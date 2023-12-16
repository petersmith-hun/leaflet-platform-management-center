import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";

/**
 * Response model representing a category.
 */
export interface CategoryModel extends IdentifiedSelfStatusAwareModel<number> {

  title: string;
  description: string;
}

/**
 * Request model representing a category.
 */
export interface CategoryEditRequest {

  title: string;
  description: string;
}
