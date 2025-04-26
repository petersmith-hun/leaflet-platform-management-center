/**
 * Supported operation domains (target entity types) for commonly usable operations.
 */
export type OperationDomain =
  "article"
  | "category"
  | "comment"
  | "deployment"
  | "directory"
  | "docker-tag"
  | "document"
  | "file"
  | "fileView"
  | "route"
  | "secret"
  | "secret-retrieval"
  | "tag"
  | "translation"
  | "user";

/**
 * Supported confirmed operations, for translated labels.
 */
export type OperationType =
  "delete"
  | "deployment-unlock"
  | "publication-publish"
  | "publication-review"
  | "publication-unpublish"
  | "retrieval-enable"
  | "retrieval-disable"
  | "status-enable"
  | "status-disable";

/**
 * Redirection paths to be used after successful submit operations
 */
export const redirectMap: { [key in OperationDomain]: string } = {
  article: "/articles",
  category: "/categories",
  comment: "/comments",
  deployment: "/system/deployments",
  directory: "/files/browse",
  "docker-tag": "/system/docker",
  document: "/documents",
  file: "/files/browse",
  fileView: "/files",
  secret: "/system/secrets",
  "secret-retrieval": "/system/secrets",
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

/**
 * Replaces dot, colon and dash symbols with underscore symbol in the given ID.
 *
 * @param id raw ID value to be sanitized
 */
export const sanitizeID = (id: string): string => {
  return id.replaceAll(/[.:\-]/gim, "_");
}
