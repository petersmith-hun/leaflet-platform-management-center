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

  created: string;
  lastModified: string;
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

export interface SEOAttributes {

  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
}

/**
 * TODO.
 */
export interface ResponseWrapper<T> {

  body: T
  pagination: Pagination;
  seo: SEOAttributes;
}
