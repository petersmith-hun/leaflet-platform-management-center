import { IdentifiedModel } from "@/core/model/common";

/**
 * Response model representing the owner of an article.
 */
export interface UserModel extends IdentifiedModel {

  username: string;
}
