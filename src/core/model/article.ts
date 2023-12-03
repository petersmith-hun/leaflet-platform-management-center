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
  published: string;
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

/**
 * TODO.
 */
export interface ArticleEditRequest {

  userID?: number;
  title: string;
  link: string;
  prologue: string;
  rawContent: string;
  categoryID: number;
  locale: string;
  enabled: boolean;
  status: ArticleStatus;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  tags: number[];
  attachments: string[];
}

/**
 * TODO.
 */
export type SelectOptionsObject = { [id: number]: string };

/**
 * TODO.
 */
export interface ArticleComposerCommonData {

  article?: ArticleEditRequest;
  categories: SelectOptionsObject;
  files: SelectOptionsObject;
  tags: SelectOptionsObject;
}

/**
 * TODO.
 */
export interface FileAttachmentRequest {

  entryID: number;
  pathUUID: string;
}

