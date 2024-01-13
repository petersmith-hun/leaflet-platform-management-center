import { APIEnvironment } from "@/api-environment";
import { CommentSearchResult } from "@/core/model/comment";
import { commentService } from "@/core/service/comment-service";

const commentPageSizeForPendingCheck = 100;

interface CommentFacade {

  /**
   * Retrieves all pending comment.
   *
   * @param page page number
   * @param limit maximum number of comments on a page
   */
  getPendingComments: (page: number, limit: number) => Promise<CommentSearchResult>;

  /**
   * Counts the pending comments by article.
   */
  getNumberOfPendingCommentsByArticle: () => Promise<Record<number, number>>;

  /**
   * Retrieves the number of pending comments for the given article.
   *
   * @param articleID ID of the article to return number of pending comments for
   */
  getNumberOfPendingCommentsForArticle: (articleID: number) => Promise<number>;
}

/**
 * Facade implementation coordinating the retrieval of comments for complex use cases.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const commentFacade = (environment: APIEnvironment): CommentFacade => {

  const { searchComments } = commentService(environment);

  const collectEntryIDs = (searchResult: CommentSearchResult): number[] => {

    return searchResult.body.comments
      .map(comment => comment.associatedEntry!)
      .map(article => article.id);
  }

  const groupCountByArticleID = (articleIDsWithPendingComment: number[]): Record<number, number> => {

    return articleIDsWithPendingComment
      .reduce((accumulator, currentValue) => {

        if (!accumulator.hasOwnProperty(currentValue)) {
          accumulator[currentValue] = 0;
        }

        accumulator[currentValue]++;

        return accumulator;

      }, {} as Record<number, number>);
  }

  const getPendingComments = async (page: number, limit: number): Promise<CommentSearchResult> => {

    return searchComments({
      page,
      limit,
      deleted: false,
      enabled: false
    })
  }

  const getNumberOfPendingCommentsByArticle = async (): Promise<Record<number, number>> => {

    let page = 1;
    const articleIDsWithPendingComment: number[] = [];

    let searchResult: CommentSearchResult;
    do {
      searchResult = await getPendingComments(page, commentPageSizeForPendingCheck);
      articleIDsWithPendingComment.push(...collectEntryIDs(searchResult));
    } while (searchResult.pagination.hasNext);

    return Promise.resolve(groupCountByArticleID(articleIDsWithPendingComment));
  }

  return {

    getPendingComments,

    getNumberOfPendingCommentsByArticle,

    async getNumberOfPendingCommentsForArticle(articleID: number): Promise<number> {

      return getNumberOfPendingCommentsByArticle()
        .then(counts => counts[articleID] ?? 0);
    }
  }
}
