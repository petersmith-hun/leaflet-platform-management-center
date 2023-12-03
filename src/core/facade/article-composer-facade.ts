import { APIEnvironment } from "@/api-environment";
import { ArticleComposerCommonData, ArticleEditRequest, SelectOptionsObject } from "@/core/model/article";
import { CategoryModel } from "@/core/model/category";
import { TagModel } from "@/core/model/tag";
import articleService from "@/core/service/article-service";
import categoryService from "@/core/service/category-service";
import tagService from "@/core/service/tag-service";

const categoriesPromiseIndex = 0;
const tagsPromiseIndex = 1;

interface ArticleComposerFacade {

  /**
   * TODO.
   */
  getCommonData: () => Promise<ArticleComposerCommonData>;

  /**
   * TODO.
   */
  submitArticle: (article: ArticleEditRequest) => Promise<number>;
}

const convertCategories = (categories: CategoryModel[]): SelectOptionsObject => {

  return Object.fromEntries(categories
    .map(category => [category.id, category.title]))
}

const convertTags = (tags: TagModel[]): SelectOptionsObject => {

  return Object.fromEntries(tags
    .map(tag => [tag.id, tag.name]));
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

  const { createArticle, attachFile, detachFile } = articleService(environment);
  const { getAllCategories } = categoryService(environment);
  const { getAllTags, attachTag, detachTag } = tagService(environment);

  return {

    getCommonData(): Promise<ArticleComposerCommonData> {

      const categories = getAllCategories();
      const tags = getAllTags();

      return Promise.all([categories, tags])
        .then(results => {
          return {
            categories: convertCategories(results[categoriesPromiseIndex]),
            files: {},
            tags: convertTags(results[tagsPromiseIndex])
          }
        });
    },

    async submitArticle(articleEditRequest: ArticleEditRequest): Promise<number> {

      const createdArticle = await createArticle(articleEditRequest);
      const articleID = createdArticle.id;
      const tagsToAttach = collectIDsToAttach(createdArticle.tags, articleEditRequest.tags, tag => tag.id);
      const tagsToDetach = collectIDsToDetach(createdArticle.tags, articleEditRequest.tags, tag => tag.id);
      const filesToAttach = collectIDsToAttach(createdArticle.attachments, articleEditRequest.attachments, file => file.pathUUID);
      const filesToDetach = collectIDsToDetach(createdArticle.attachments, articleEditRequest.attachments, file => file.pathUUID);

      await Promise.all(tagsToAttach
        .map(tagID => {
          return { tagID, entryID: articleID }
        })
        .map(attachTag));
      await Promise.all(tagsToDetach
        .map(tagID => {
          return { tagID, entryID: articleID }
        })
        .map(detachTag));
      await Promise.all(filesToAttach
        .map(pathUUID => {
          return { pathUUID, entryID: articleID }
        })
        .map(attachFile));
      await Promise.all(filesToDetach
        .map(pathUUID => {
          return { pathUUID, entryID: articleID }
        })
        .map(detachFile));

      return Promise.resolve(articleID);
    }
  }
}
