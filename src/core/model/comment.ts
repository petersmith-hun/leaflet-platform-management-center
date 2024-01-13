import { ArticleModel } from "@/core/model/article";
import { IdentifiedSelfStatusAwareModel, ResponseWrapper } from "@/core/model/common";
import { UserModel } from "@/core/model/user";

/**
 * Response model representing a comment.
 */
export interface CommentModel extends IdentifiedSelfStatusAwareModel<number> {

  owner: UserModel;
  associatedEntry?: ArticleModel;
  content: string;
  deleted: boolean;
}

/**
 * Request model containing the supported comment search parameters.
 */
export class CommentSearchParameters {

  readonly page?: number;
  readonly orderBy?: string;
  readonly orderDirection?: string;
  readonly limit?: number;
  readonly enabled?: boolean;
  readonly deleted?: boolean;
  readonly content?: string;

  constructor(opts: CommentSearchParameters) {
    Object.assign(this, {
      page: 1,
      ... opts
    });
  }
}

/**
 * Simple wrapper for a list of comments returned by the search endpoint.
 */
export type CommentSearchResult = ResponseWrapper<{comments: CommentModel[]}>;

/**
 * Request model representing a comment for moderation.
 */
export interface CommentEditRequest {

  content: string;
}
