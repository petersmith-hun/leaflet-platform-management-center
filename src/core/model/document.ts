import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";
import { UserModel } from "@/core/model/user";

/**
 * Response model representing a document.
 */
export interface DocumentModel extends IdentifiedSelfStatusAwareModel<number> {

  title: string;
  link: string;
  locale: string;
  rawContent: string;
  user: UserModel;
}

/**
 * Request model representing a document.
 */
export interface DocumentEditRequest {

  userID?: number;
  title: string;
  link: string;
  rawContent: string;
  locale: string;
  enabled: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
