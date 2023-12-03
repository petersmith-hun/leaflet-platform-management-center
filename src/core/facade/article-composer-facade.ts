import { APIEnvironment } from "@/api-environment";
import { ArticleComposerCommonData, ArticleEditRequest, ArticleModel, SelectOptionsObject } from "@/core/model/article";
import { CategoryModel } from "@/core/model/category";
import { ResponseWrapper } from "@/core/model/common";
import { TagModel } from "@/core/model/tag";
import articleService from "@/core/service/article-service";
import categoryService from "@/core/service/category-service";
import tagService from "@/core/service/tag-service";

const categoriesPromiseIndex = 0;
const tagsPromiseIndex = 1;
const articlePromiseIndex = 2;

interface ArticleComposerFacade {

  /**
   * TODO.
   *
   * @param articleID
   */
  getCommonData: (articleID?: number) => Promise<ArticleComposerCommonData>;

  /**
   * TODO.
   *
   * @param article
   * @param id
   */
  submitArticle: (article: ArticleEditRequest, articleID?: number) => Promise<number>;
}

const convertCategories = (categories: CategoryModel[]): SelectOptionsObject => {

  return Object.fromEntries(categories
    .map(category => [category.id, category.title]))
}

const convertTags = (tags: TagModel[]): SelectOptionsObject => {

  return Object.fromEntries(tags
    .map(tag => [tag.id, tag.name]));
}

const convertArticleToEditRequest = (article: ResponseWrapper<ArticleModel>): ArticleEditRequest => {

  return {
    attachments: article.body.attachments
      .map(file => file.pathUUID),
    categoryID: article.body.category.id,
    enabled: article.body.enabled,
    link: article.body.link,
    locale: article.body.locale,
    metaDescription: article.seo.metaDescription,
    metaKeywords: article.seo.metaKeywords ?? "",
    metaTitle: article.seo.metaTitle,
    prologue: article.body.prologue,
    rawContent: article.body.rawContent,
    status: article.body.entryStatus,
    tags: article.body.tags
      // this is a trick needed for repopulating the tag assignment multi-select field
      // for some reason, it does not work with numbers (single select does)
      .map(tag => `${tag.id}` as unknown as number),
    title: article.body.title,
    userID: article.body.user.id
  }
}

/**
 * TODO.
 *
 * @param itemsAlreadyAttached
 * @param itemAttachmentsRequested
 * @param idExtractor
 */
const collectIDsToAttach = <ID, M>(itemsAlreadyAttached: M[],
                                   itemAttachmentsRequested: ID[],
                                   idExtractor: (item: M) => ID): ID[] => {

  let idListToAttach: ID[];
  if (!itemsAlreadyAttached.length) {
    idListToAttach = itemAttachmentsRequested;
  } else {
    const alreadyAttached = itemsAlreadyAttached.map(idExtractor);
    idListToAttach = itemAttachmentsRequested
      .filter(itemID => !alreadyAttached.includes(itemID));
  }

  return idListToAttach;
}

/**
 * TODO.
 *
 * @param itemsCurrentlyAttached
 * @param itemAttachmentsRequested
 * @param idExtractor
 */
const collectIDsToDetach = <ID, M>(itemsCurrentlyAttached: M[],
                                   itemAttachmentsRequested: ID[],
                                   idExtractor: (item: M) => ID): ID[] => {

  let idListToDetach: ID[] = [];
  if (itemsCurrentlyAttached.length) {
    const currentlyAttached = itemsCurrentlyAttached.map(idExtractor);
    idListToDetach = currentlyAttached
      .filter(itemID => !itemAttachmentsRequested.includes(itemID));
  }

  return idListToDetach;
}

/**
 * TODO.
 *
 * @param environment
 */
export const articleComposerFacade = (environment: APIEnvironment): ArticleComposerFacade => {

  const { getArticleByID, createArticle, updateArticle, attachFile, detachFile } = articleService(environment);
  const { getAllCategories } = categoryService(environment);
  const { getAllTags, attachTag, detachTag } = tagService(environment);

  return {

    getCommonData(articleID?: number): Promise<ArticleComposerCommonData> {

      const categories = getAllCategories();
      const tags = getAllTags();
      const article = articleID
        ? getArticleByID(articleID).then(convertArticleToEditRequest)
        : Promise.resolve(undefined);

      return Promise.all([categories, tags, article])
        .then(results => {
          return {
            categories: convertCategories(results[categoriesPromiseIndex]),
            files: {},
            tags: convertTags(results[tagsPromiseIndex]),
            article: results[articlePromiseIndex]
          }
        });
    },

    async submitArticle(articleEditRequest: ArticleEditRequest, articleID?: number): Promise<number> {

      const createdArticle = await (articleID
        ? updateArticle(articleID, articleEditRequest)
        : createArticle(articleEditRequest));
      const createdArticleID = createdArticle.id;
      const tagsToAttach = collectIDsToAttach(createdArticle.tags, articleEditRequest.tags, tag => tag.id);
      const tagsToDetach = collectIDsToDetach(createdArticle.tags, articleEditRequest.tags, tag => tag.id);
      const filesToAttach = collectIDsToAttach(createdArticle.attachments, articleEditRequest.attachments, file => file.pathUUID);
      const filesToDetach = collectIDsToDetach(createdArticle.attachments, articleEditRequest.attachments, file => file.pathUUID);

      // TODO try to optimize this a bit
      await Promise.all(tagsToAttach
        .map(tagID => {
          return { tagID, entryID: createdArticleID }
        })
        .map(attachTag));
      await Promise.all(tagsToDetach
        .map(tagID => {
          return { tagID, entryID: createdArticleID }
        })
        .map(detachTag));
      await Promise.all(filesToAttach
        .map(pathUUID => {
          return { pathUUID, entryID: createdArticleID }
        })
        .map(attachFile));
      await Promise.all(filesToDetach
        .map(pathUUID => {
          return { pathUUID, entryID: createdArticleID }
        })
        .map(detachFile));

      return Promise.resolve(createdArticleID);
    }
  }
}
