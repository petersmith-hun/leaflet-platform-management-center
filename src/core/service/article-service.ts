import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { ArticleModel, ArticleSearchParameters, ArticleSearchResult, ArticleStatus } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";

interface ArticleService {

  /**
   * TODO.
   *
   * @param id
   */
  getArticleByID: (id: number) => Promise<ResponseWrapper<ArticleModel>>;

  /**
   * TODO.
   *
   * @param searchParameters
   */
  searchArticles: (searchParameters: ArticleSearchParameters) => Promise<ArticleSearchResult>;

  /**
   * TODO.
   *
   * @param id
   */
  changeGeneralStatus: (id: number) => Promise<void>;

  /**
   * TODO.
   *
   * @param id
   * @param currentStatus
   */
  changePublicationStatus: (id: number, currentStatus: ArticleStatus) => Promise<void>;

  /**
   * TODO.
   *
   * @param id
   */
  deleteArticleByID: (id: number) => Promise<void>;
}

/**
 * TODO.
 *
 * @param environment
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
    }
  }
}

export default articleService;
