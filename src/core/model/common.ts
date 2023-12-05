/**
 * Base response model representing an identifiable entity (has an ID field).
 */
export interface IdentifiedModel {

  id: number;
}

/**
 * Base response model representing a self-status aware entity (has creation and last modification date, as well as an
 * enabled flag).
 */
export interface IdentifiedSelfStatusAwareModel extends IdentifiedModel {

  created: string;
  lastModified: string;
  enabled: boolean;
}

/**
 * Response model representing pagination information.
 */
export interface Pagination {

  entityCount: number;
  pageCount: number;
  pageNumber: number;
  entityCountOnPage: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Response model representing SEO information.
 */
export interface SEOAttributes {

  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
}

/**
 * Response wrapper model for endpoints returning response-filled data (includes pagination and SEO information along
 * with the requested data itself).
 */
export interface ResponseWrapper<T> {

  body: T
  pagination: Pagination;
  seo: SEOAttributes;
}

/**
 * Response model representing a simple error.
 */
export interface ErrorResponse {

  message: string;
}

/**
 * Response model representing a validation error.
 */
export interface ValidationErrorResponse {

  validation: { field: string, message: string }[]
}
