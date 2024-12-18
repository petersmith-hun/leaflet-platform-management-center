/**
 * Supported operation domains (target entity types) for commonly usable operations.
 */
export type OperationDomain =
  "article"
  | "category"
  | "comment"
  | "deployment"
  | "directory"
  | "document"
  | "file"
  | "fileView"
  | "route"
  | "tag"
  | "translation"
  | "user";

/**
 * Redirection paths to be used after successful submit operations
 */
export const redirectMap: { [key in OperationDomain]: string } = {
  article: "/articles",
  category: "/categories",
  comment: "/comments",
  deployment: "/system/deployments",
  directory: "/files/browse",
  document: "/documents",
  file: "/files/browse",
  fileView: "/files",
  route: "/system/routes",
  tag: "/tags",
  translation: "/system/translations",
  user: "/users"
};

/**
 * Common operation properties.
 */
export interface OperationProps<T> {

  domain: OperationDomain;
  entity: T;
  titleSupplier: (entity: T) => string;
}
