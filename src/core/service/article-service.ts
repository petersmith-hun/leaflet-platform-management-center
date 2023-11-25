import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { ArticleModel, ArticleSearchParameters, ArticleSearchResult } from "@/core/model/article";

interface ArticleService {

  /**
   * TODO.
   *
   * @param id
   */
  getArticleByID: (id: number) => Promise<ArticleModel>;

  /**
   * TODO.
   *
   * @param searchParameters
   */
  searchArticles: (searchParameters: ArticleSearchParameters) => Promise<ArticleSearchResult>;
}

/**
 * TODO.
 *
 * @param environment
 */
const articleService = (environment: APIEnvironment): ArticleService => {

  return {

    getArticleByID: async (id: number): Promise<ArticleModel> => {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.ARTICLE_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization
      });

      return leafletClient(environment, request, true);
    },

    searchArticles(searchParameters: ArticleSearchParameters): Promise<ArticleSearchResult> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.ARTICLE_SEARCH,
        authorization: environment.authorization,
        queryParameters: searchParameters
      });

      return leafletClient(environment, request, false);
    }
  }
}

export default articleService;
