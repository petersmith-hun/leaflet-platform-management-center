import { CategoryModel } from "@/core/model/category";
import { IdentifiedSelfStatusAwareModel, ResponseWrapper } from "@/core/model/common";
import { FileDataModel } from "@/core/model/files";
import { TagModel } from "@/core/model/tag";
import { UserModel } from "@/core/model/user";

/**
 * Supported article statuses.
 */
export enum ArticleStatus {

  /**
   * Article is a draft, not meant for publication.
   */
  DRAFT = "DRAFT",

  /**
   * Article is in review phase, waiting to be published.
   */
  REVIEW = "REVIEW",

  /**
   * Article is public.
   */
  PUBLIC = "PUBLIC"
}

/**
 * Response model representing an article.
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
 * Request model containing the supported article search parameters.
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
 * Simple wrapper for a list of articles returned by the search endpoint.
 */
export type ArticleSearchResult = ResponseWrapper<{ entries: ArticleModel[] }>

/**
 * Request model representing an article.
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
 * Type directive for select dropdown field options.
 */
export type SelectOptionsObject = { [id: number]: string };

/**
 * Wrapper object representing all data returned to the article composer screen.
 */
export interface ArticleComposerCommonData {

  article?: ArticleEditRequest;
  categories: SelectOptionsObject;
  files: SelectOptionsObject;
  tags: SelectOptionsObject;
}

/**
 * Request model representing a file assignment.
 */
export interface FileAttachmentRequest {

  entryID: number;
  pathUUID: string;
}

