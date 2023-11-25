import { CategoryModel } from "@/core/model/category";
import { IdentifiedSelfStatusAwareModel, ResponseWrapper } from "@/core/model/common";
import { FileDataModel } from "@/core/model/files";
import { TagModel } from "@/core/model/tag";
import { UserModel } from "@/core/model/user";

/**
 * TODO.
 */
export enum ArticleStatus {

  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLIC = "PUBLIC"
}

/**
 * TODO.
 */
export interface ArticleModel extends IdentifiedSelfStatusAwareModel {

  title: string;
  link: string;
  prologue: string;
  user: UserModel;
  tags: TagModel[];
  category: CategoryModel;
  attachments: FileDataModel[];
  locale: string;
  published: Date;
  rawContent: string;
  entryStatus: ArticleStatus
}

/**
 * TODO.
 */
export class ArticleSearchParameters {

  readonly page?: number;
  readonly orderBy?: string;
  readonly orderDirection?: string;
  readonly limit?: number;
  readonly enabled?: boolean;
  readonly categoryID?: number;
  readonly status?: string;
  readonly content?: string;

  constructor(opts: ArticleSearchParameters) {
    Object.assign(this, {
      page: 1,
      ... opts
    });
  }
}

/**
 * TODO.
 */
export type ArticleSearchResult = ResponseWrapper<{ entries: ArticleModel[] }>