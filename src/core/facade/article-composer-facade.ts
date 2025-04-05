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
import { FileDataModel } from "@/core/model/files";
import { TagAssignmentRequest, TagModel } from "@/core/model/tag";
import articleService from "@/core/service/article-service";
import categoryService from "@/core/service/category-service";
import { fileService } from "@/core/service/file-service";
import tagService from "@/core/service/tag-service";
import { entityDifferentCalculator } from "@/core/util/entity-difference-calculator";

const articlePromiseIndex = 0;
const categoriesPromiseIndex = 1;
const tagsPromiseIndex = 2;

interface ArticleComposerFacade {

  /**
   * Retrieves the commonly used pieces of data for the article composer screen (list of categories, tags, uploaded
   * files). Also retrieves the article data for the article editor screen (if the ID is provided).
   *
   * @param articleID ID of the article to return data of
   */
  getCommonData: (articleID?: number) => Promise<ArticleComposerCommonData>;

  /**
   * Submits the composed article, while also dealing with the tag and file assignments. To edit an existing article,
   * article ID must be also provided. Returns the ID of the created/edited article.
   *
   * @param article article data to be submitted
   * @param articleID ID of an existing article to update
   */
  submitArticle: (article: ArticleEditRequest, articleID?: number) => Promise<ArticleModel>;
}

const convertCategories = (categories: CategoryModel[]): SelectOptionsObject => {

  return Object.fromEntries(categories
    .map(category => [category.id, category.title]))
}

const convertFiles = (files: FileDataModel[]): SelectOptionsObject => {

  return Object.fromEntries(files
    .map(file => [file.pathUUID, file.originalFilename]));
}

const convertTags = (tags: TagModel[]): SelectOptionsObject => {

  return Object.fromEntries(tags
    .map(tag => [tag.id, tag.name]));
}

const convertFileReferenceToID = (file: FileDataModel): string => {
  return file.reference.split("/")[1];
}

const convertArticleToEditRequest = (article: ResponseWrapper<ArticleModel>): ArticleEditRequest => {

  return {
    attachments: article.body.attachments
      .map(convertFileReferenceToID),
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
 * Facade implementation coordinating the population of the article composer/editor screen, as well as submitting a new article.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const articleComposerFacade = (environment: APIEnvironment): ArticleComposerFacade => {

  const { getArticleByID, createArticle, updateArticle, attachFile, detachFile } = articleService(environment);
  const { getUploadedFiles } = fileService(environment);
  const { getAllCategories } = categoryService(environment);
  const { getAllTags, attachTag, detachTag } = tagService(environment);

  return {

    async getCommonData(articleID?: number): Promise<ArticleComposerCommonData> {

      let filesAvailable = true;
      let files: FileDataModel[];
      try {
        files = await getUploadedFiles();
      } catch (error) {
        filesAvailable = false;
        files = [];
      }

      const categories = getAllCategories();
      const tags = getAllTags();
      const article = articleID
        ? getArticleByID(articleID).then(convertArticleToEditRequest)
        : Promise.resolve(undefined);

      return Promise.all([article, categories, tags])
        .then(results => {
          return {
            article: results[articlePromiseIndex],
            categories: convertCategories(results[categoriesPromiseIndex]),
            files: convertFiles(files),
            tags: convertTags(results[tagsPromiseIndex]),
            filesAvailable: filesAvailable
          }
        });
    },

    async submitArticle(articleEditRequest: ArticleEditRequest, articleID?: number): Promise<ArticleModel> {

      const createdArticle = await (articleID
        ? updateArticle(articleID, articleEditRequest)
        : createArticle(articleEditRequest));
      const createdArticleID = createdArticle.id;

      // same issue here as on line #84
      // @ts-ignore
      const tags = entityDifferentCalculator(createdArticle.tags, articleEditRequest.tags, tag => `${tag.id}`);
      const files = entityDifferentCalculator(createdArticle.attachments, articleEditRequest.attachments, convertFileReferenceToID);

      await executeAssignments(attachTag, tags.attach
        .map(tagID => createTagAssignment(createdArticleID, tagID)));
      await executeAssignments(detachTag, tags.detach
        .map(tagID => createTagAssignment(createdArticleID, tagID)));
      await executeAssignments(attachFile, files.attach
        .map(pathUUID => createFileAssignment(createdArticleID, pathUUID)));
      await executeAssignments(detachFile, files.detach
        .map(pathUUID => createFileAssignment(createdArticleID, pathUUID)));

      return Promise.resolve(createdArticle);
    }
  }
}
