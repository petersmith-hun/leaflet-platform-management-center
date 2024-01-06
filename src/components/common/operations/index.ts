/**
 * Supported operation domains (target entity types) for commonly usable operations.
 */
export type OperationDomain = "article" | "category" | "directory" | "document" | "file" | "fileView" | "tag" | "user";

/**
 * Redirection paths to be used after successful submit operations
 */
export const redirectMap: { [key in OperationDomain]: string } = {
  article: "/articles",
  category: "/categories",
  directory: "/files/browse",
  document: "/documents",
  file: "/files/browse",
  fileView: "/files",
  tag: "/tags",
  user: "/user"
};

/**
 * Common operation properties.
 */
export interface OperationProps<T> {

  domain: OperationDomain;
  entity: T;
  titleSupplier: (entity: T) => string;
}
