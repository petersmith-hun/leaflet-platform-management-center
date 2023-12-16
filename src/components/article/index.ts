import { APIEnvironment } from "@/api-environment";
import { ArticleModel } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";
import { KeyedMutator } from "swr";

/**
 * Parameters of operations available through the view article screen.
 */
export interface ViewArticleScreenParameters {
  article: ResponseWrapper<ArticleModel>;
  environment: APIEnvironment;
  mutate: KeyedMutator<ResponseWrapper<ArticleModel>>;
}
