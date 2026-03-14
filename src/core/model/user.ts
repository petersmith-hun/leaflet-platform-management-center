import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";

/**
 * Supported user roles as enum.
 */
export enum Role {

  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
  EXTERNAL_USER = "EXTERNAL_USER"
}

/**
 * Supported user locales.
 */
export enum Locale {

  HU = "HU",
  EN = "EN"
}

export enum AccountType {

  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB"
}

/**
 * Response model representing the owner of an article.
 */
export interface UserModel extends IdentifiedSelfStatusAwareModel<number> {

  username: string;
  email: string,
  role: Role,
  locale: Locale,
  accountType: AccountType,
  externalID: string,
  lastLogin: string
}

/**
 * Request model representing a user profile update request.
 */
export interface UserProfileUpdateRequestModel {

  username: string;
  email: string;
  defaultLocale: Locale;
}

/**
 * Request model representing a user creation request.
 */
export interface UserCreationRequestModel extends UserProfileUpdateRequestModel {

  role: Role;
}

/**
 * Request model representing a user role update request.
 */
export interface UserRoleUpdateRequestModel {

  role: Role;
}
