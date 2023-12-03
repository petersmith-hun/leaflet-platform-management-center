/**
 * Supported permission types.
 */
export enum Permission {

  READ_CATEGORIES = "read:categories",
  READ_COMMENTS = "read:comments",
  READ_DOCUMENTS = "read:documents",
  READ_ENTRIES = "read:entries",
  READ_TAGS = "read:tags",
  READ_USERS = "read:users",
  READ_ADMIN = "read:admin",

  WRITE_CATEGORIES = "write:categories",
  WRITE_COMMENTS = "write:comments",
  WRITE_DOCUMENTS = "write:documents",
  WRITE_ENTRIES = "write:entries",
  WRITE_TAGS = "write:tags",
  WRITE_USERS = "write:users",
  WRITE_ADMIN = "write:admin"
}

/**
 * Model representing the active user's data.
 */
export type UserInfo = {

  /**
   * User ID.
   */
  id: number;

  /**
   * Email address of the active user.
   */
  email: string,

  /**
   * Display name of the active user.
   */
  name: string
}
