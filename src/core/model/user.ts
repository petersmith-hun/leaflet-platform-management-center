import { IdentifiedModel } from "@/core/model/common";

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

/**
 * Response model representing the owner of an article.
 */
export interface UserModel extends IdentifiedModel<number> {

  username: string;
  email: string,
  role: Role,
  locale: Locale,
  created: string,
  lastModified: string
}

/**
 * Request model representing a password and its confirmation.
 */
export interface PasswordRequestModel {

  password: string;
  passwordConfirmation: string;
}

/**
 * Request model representing a password update request.
 */
export interface PasswordChangeRequestModel extends PasswordRequestModel {

  currentPassword: string;
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
export interface UserCreationRequestModel extends PasswordRequestModel, UserProfileUpdateRequestModel {

  role: Role;
}

/**
 * Request model representing a user role update request.
 */
export interface UserRoleUpdateRequestModel {

  role: Role;
}

/**
 * Request model representing an account deletion request.
 */
export interface AccountDeletionRequestModel {

  email: string;
}
