import { Permission } from "@/core/domain/auth";
import { DefaultSession } from "next-auth"

/**
 * Type re-definitions for next-auth.
 */
declare module "next-auth" {

  /**
   * User Session object re-definition, adding the access token as string, and the permissions as list of Permission enum constants.
   */
  interface Session {
    accessToken: string;
    expiresAt: Date;
    scope: Permission[];
    user: DefaultSession["user"]
  }
}
