import { APIEnvironment } from "@/api-environment";
import {
  ArticleComposerCommonData,
  ArticleEditRequest,
  ArticleModel,
  FileAttachmentRequest,
  SelectOptionsObject
} from "@/core/model/article";
import { CategoryModel } from "@/core/model/category";
import { ResponseWrapper } from "@/core/model/common";
import { TagAssignmentRequest, TagModel } from "@/core/model/tag";
import articleService from "@/core/service/article-service";
import categoryService from "@/core/service/category-service";
import tagService from "@/core/service/tag-service";
import { entityDifferentCalculator } from "@/core/util/entity-difference-calculator";

const articlePromiseIndex = 0;
const categoriesPromiseIndex = 1;
const tagsPromiseIndex = 3;

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

const createTagAssignment = (articleID: number, tagID: number): TagAssignmentRequest => {
  return { tagID, entryID: articleID }
}

const createFileAssignment = (articleID: number, pathUUID: string): FileAttachmentRequest => {
  return { pathUUID, entryID: articleID }
}

const executeAssignments = async <T>(serviceCall: (request: T) => Promise<void>, requests: T[]): Promise<void> => {

  for (const request of requests) {
    await serviceCall(request);
  }

  return Promise.resolve();
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

      return Promise.all([article, categories, Promise.resolve(undefined), tags])
        .then(results => {
          return {
            article: results[articlePromiseIndex],
            categories: convertCategories(results[categoriesPromiseIndex]),
            files: {},
            tags: convertTags(results[tagsPromiseIndex])
          }
        });
    },

    async submitArticle(articleEditRequest: ArticleEditRequest, articleID?: number): Promise<number> {

      const createdArticle = await (articleID
        ? updateArticle(articleID, articleEditRequest)
        : createArticle(articleEditRequest));
      const createdArticleID = createdArticle.id;

      const tags = entityDifferentCalculator(createdArticle.tags, articleEditRequest.tags, tag => tag.id);
      const files = entityDifferentCalculator(createdArticle.attachments, articleEditRequest.attachments, file => file.pathUUID);

      await executeAssignments(attachTag, tags.attach
        .map(tagID => createTagAssignment(createdArticleID, tagID)));
      await executeAssignments(detachTag, tags.detach
        .map(tagID => createTagAssignment(createdArticleID, tagID)));
      await executeAssignments(attachFile, files.attach
        .map(pathUUID => createFileAssignment(createdArticleID, pathUUID)));
      await executeAssignments(detachFile, files.detach
        .map(pathUUID => createFileAssignment(createdArticleID, pathUUID)));

      return Promise.resolve(createdArticleID);
    }
  }
}
