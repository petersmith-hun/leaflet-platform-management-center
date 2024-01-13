import { APIEnvironment } from "@/api-environment";
import { commentFacade } from "@/core/facade/comment-facade";
import { ArticleModel, ArticleSearchParameters, ArticleSearchResult } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";
import articleService from "@/core/service/article-service";

interface ArticleLookupFacade {

  /**
   * Retrieves a single article by its ID. Also checks for pending comments, and injects the pending comment count into
   * the result model.
   *
   * @param id article ID
   */
  getArticleByID: (id: number) => Promise<ResponseWrapper<ArticleModel>>;

  /**
   * Retrieves a set of articles based on the provided search parameters. Also checks for pending comments, and injects
   * the pending comment counts into the result model.
   *
   * @param searchParameters article search parameters
   */
  searchArticles: (searchParameters: ArticleSearchParameters) => Promise<ArticleSearchResult>;
}

/**
 * Facade implementation coordinating the retrieval of articles as well as their related comments.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const articleLookupFacade = (environment: APIEnvironment): ArticleLookupFacade => {

  const { getArticleByID, searchArticles } = articleService(environment);
  const { getNumberOfPendingCommentsByArticle, getNumberOfPendingCommentsForArticle } = commentFacade(environment);

  return {

    async getArticleByID(id: number): Promise<ResponseWrapper<ArticleModel>> {

      const article = await getArticleByID(id);
      article.body.pendingCommentCount = await getNumberOfPendingCommentsForArticle(id);

      return article;
    },

    async searchArticles(searchParameters: ArticleSearchParameters): Promise<ArticleSearchResult> {

      const searchResult = await searchArticles(searchParameters);
      const pendingCommentsByArticle = await getNumberOfPendingCommentsByArticle();

      searchResult.body.entries
        .forEach(article => article.pendingCommentCount = pendingCommentsByArticle[article.id] ?? 0);

      return searchResult;
    }
  }
}
