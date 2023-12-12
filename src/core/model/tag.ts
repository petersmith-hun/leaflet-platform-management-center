import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";

/**
 * Response model representing a tag.
 */
export interface TagModel extends IdentifiedSelfStatusAwareModel {

  id: number;
  name: string;
}

/**
 * Request model representing a tag.
 */
export interface TagEditRequest {

  name: string;
}

/**
 * Request model representing a tag assignment.
 */
export interface TagAssignmentRequest {

  entryID: number;
  tagID: number;
}
