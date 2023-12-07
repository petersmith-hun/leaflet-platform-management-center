import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import {
  ArticleEditRequest,
  ArticleModel,
  ArticleSearchParameters,
  ArticleSearchResult,
  ArticleStatus,
  FileAttachmentRequest
} from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";

interface ArticleService {

  /**
   * Retrieves a single article by its ID.
   *
   * @param id article ID
   */
  getArticleByID: (id: number) => Promise<ResponseWrapper<ArticleModel>>;

  /**
   * Retrieves a set of articles based on the provided search parameters.
   *
   * @param searchParameters article search parameters
   */
  searchArticles: (searchParameters: ArticleSearchParameters) => Promise<ArticleSearchResult>;

  /**
   * Creates a new article.
   *
   * @param article article data to be submitted
   */
  createArticle: (article: ArticleEditRequest) => Promise<ArticleModel>;

  /**
   * Modifies an existing article.
   *
   * @param id ID of article to be updated
   * @param article article data to be submitted
   */
  updateArticle: (id: number, article: ArticleEditRequest) => Promise<ArticleModel>;

  /**
   * Flips the general status (enabled/disabled) of the given article.
   *
   * @param id ID of article to be updated
   */
  changeGeneralStatus: (id: number) => Promise<void>;

  /**
   * Updates the publication status of the given article.
   *
   * @param id ID of article to be updated
   * @param currentStatus publication status to transition the article to
   */
  changePublicationStatus: (id: number, currentStatus: ArticleStatus) => Promise<void>;

  /**
   * Removes an existing article.
   *
   * @param id ID of article to be deleted
   */
  deleteArticleByID: (id: number) => Promise<void>;

  /**
   * Attaches the given file to the article as an attachment.
   *
   * @param attachmentRequest file-article attachment request
   */
  attachFile: (attachmentRequest: FileAttachmentRequest) => Promise<void>;

  /**
   * Detaches the given file from the article.
   *
   * @param attachmentRequest file-article detachment request
   */
  detachFile: (attachmentRequest: FileAttachmentRequest) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling article management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
const articleService = (environment: APIEnvironment): ArticleService => {

  const publicationStatusTransitions = {
    [ArticleStatus.PUBLIC]: ArticleStatus.DRAFT,
    [ArticleStatus.DRAFT]: ArticleStatus.REVIEW,
    [ArticleStatus.REVIEW]: ArticleStatus.PUBLIC
  };

  return {

    getArticleByID: async (id: number): Promise<ResponseWrapper<ArticleModel>> => {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.ARTICLE_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    searchArticles(searchParameters: ArticleSearchParameters): Promise<ArticleSearchResult> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.ARTICLE_SEARCH,
        authorization: environment.authorization!,
        queryParameters: searchParameters
      });

      return leafletClient(environment, request);
    },

    changeGeneralStatus(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.ARTICLE_GENERAL_STATUS,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    createArticle(article: ArticleEditRequest): Promise<ArticleModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.ARTICLE,
        requestBody: article,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    updateArticle(id: number, article: ArticleEditRequest): Promise<ArticleModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.ARTICLE_BY_ID,
        pathParameters: { id },
        requestBody: article,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    changePublicationStatus(id: number, currentStatus: ArticleStatus): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.ARTICLE_PUBLICATION_STATUS,
        pathParameters: { id, status: publicationStatusTransitions[currentStatus] },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    deleteArticleByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.ARTICLE_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    attachFile(attachmentRequest: FileAttachmentRequest): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.ATTACHMENTS,
        requestBody: attachmentRequest,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    detachFile(attachmentRequest: FileAttachmentRequest): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.ATTACHMENTS,
        requestBody: attachmentRequest,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    }
  }
}

export default articleService;
