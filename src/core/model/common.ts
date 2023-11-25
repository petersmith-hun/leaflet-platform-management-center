/**
 * TODO.
 */
export interface IdentifiedModel {

  id: number;
}

/**
 * TODO.
 */
export interface IdentifiedSelfStatusAwareModel extends IdentifiedModel {

  created: Date;
  lastModified: Date;
  enabled: boolean;
}

/**
 * TODO.
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
 * TODO.
 */
export interface ResponseWrapper<T> {
  body: T
  pagination: Pagination;
}