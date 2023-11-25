import { Permission, UserInfo } from "@/core/domain/auth";
import { useSession } from "next-auth/react";

interface SessionHelperHookReturn {

  /**
   * Returns an Authorization header to be used in REST calls.
   */
  getAuthorizationHeader: () => { Authorization: string };

  /**
   * Returns information about the active user.
   */
  getUserInfo: () => UserInfo;

  /**
   * Checks if the given permission is granted to the current user.
   *
   * @param permission permission to be checked
   */
  hasPermission: (permission: Permission) => boolean;
}

/**
 * Utilities for accessing user session information.
 */
export const useSessionHelper = (): SessionHelperHookReturn => {

  const session = useSession({ required: true });

  return {
    getAuthorizationHeader: () => {
      return {
        Authorization: `Bearer ${session.data?.accessToken ?? "Unknown"}`
      }
    },
    getUserInfo: () => {
      return {
        name: session.data?.user?.name ?? "Unknown",
        email: session.data?.user?.email ?? "Unknown"
      }
    },
    hasPermission: permission => session.data?.scope.includes(permission) ?? false
  }
}
