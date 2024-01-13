import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { CommentEditRequest, CommentModel, CommentSearchParameters, CommentSearchResult } from "@/core/model/comment";

interface CommentService {

  /**
   * Retrieves a single comment by its ID.
   *
   * @param id comment ID
   */
  getCommentByID: (id: number) => Promise<CommentModel>;

  /**
   * Retrieves a set of comments based on the provided search parameters.
   *
   * @param searchParameters comment search parameters
   */
  searchComments: (searchParameters: CommentSearchParameters) => Promise<CommentSearchResult>;

  /**
   * Retrieves the given page of comments for the specified article.
   *
   * @param articleID ID of the article to retrieve comments of
   * @param page page number
   */
  getPageOfCommentsForArticle: (articleID: number, page: number) => Promise<CommentSearchResult>;

  /**
   * Modifies an existing comment.
   *
   * @param id ID of comment to be updated
   * @param comment comment data to be submitted
   */
  editComment: (id: number, comment: CommentEditRequest) => Promise<CommentModel>;

  /**
   * Flips the general status (enabled/disabled) of the given comment.
   *
   * @param id ID of comment to be updated
   */
  changeGeneralStatus: (id: number) => Promise<CommentModel>;

  /**
   * Logically deletes an existing comment.
   *
   * @param id ID of comment to be deleted
   */
  deleteCommentByID: (id: number) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling comment management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const commentService = (environment: APIEnvironment): CommentService => {

  return {

    async getCommentByID(id: number): Promise<CommentModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.COMMENTS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async searchComments(searchParameters: CommentSearchParameters): Promise<CommentSearchResult> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.COMMENTS_SEARCH,
        authorization: environment.authorization!,
        queryParameters: searchParameters
      });

      return leafletClient(environment, request);
    },

    async getPageOfCommentsForArticle(articleID: number, page: number): Promise<CommentSearchResult> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.COMMENTS_ALL_PAGE_BY_ARTICLE,
        authorization: environment.authorization!,
        pathParameters: { id: articleID, page },
        queryParameters: { orderBy: "CREATED", orderDirection: "DESC" }
      });

      return leafletClient(environment, request);
    },

    async editComment(id: number, comment: CommentEditRequest): Promise<CommentModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.COMMENTS_BY_ID,
        pathParameters: { id },
        requestBody: comment,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async changeGeneralStatus(id: number): Promise<CommentModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.COMMENTS_GENERAL_STATUS,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async deleteCommentByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.COMMENTS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },
  }
}
