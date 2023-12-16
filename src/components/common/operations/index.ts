/**
 * Supported operation domains (target entity types) for commonly usable operations.
 */
export type OperationDomain = "article" | "category" | "document" | "file" | "tag" | "user";

export const redirectMap: { [key in OperationDomain]: string } = {
  article: "/articles",
  category: "/categories",
  document: "/documents",
  file: "/files",
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
