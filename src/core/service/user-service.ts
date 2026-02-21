import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { SimplifiedPageModel } from "@/core/model/common";
import {
  PasswordChangeRequestModel,
  PasswordRequestModel,
  UserCreationRequestModel,
  UserModel,
  UserProfileUpdateRequestModel,
  UserRoleUpdateRequestModel
} from "@/core/model/user";

enum UserPaths {
  USERS = "/access-management/users",
  USERS_BY_ID = "/access-management/users/{id}",
  USERS_BY_ID_STATUS = "/access-management/users/{id}/status",
  USERS_BY_ID_ROLE = "/access-management/users/{id}/role",
}

interface UserService {

  /**
   * Retrieves all existing user.
   *
   * @param page 1-based page number
   */
  getAllUsers: (page?: number) => Promise<SimplifiedPageModel<UserModel>>;

  /**
   * Retrieves the user identified by the given ID.
   *
   * @param id ID of the user to retrieve
   */
  getUserByID: (id: number) => Promise<UserModel>;

  /**
   * Creates a new user.
   *
   * @param user user data to be submitted
   */
  createUser: (user: UserCreationRequestModel) => Promise<UserModel>;

  /**
   * Enables the given user.
   *
   * @param id ID of user to be updated
   */
  enableUser: (id: number) => Promise<UserModel>;

  /**
   * Disables the given user.
   *
   * @param id ID of user to be updated
   */
  disableUser: (id: number) => Promise<UserModel>;

  /**
   * Updates the role of the given user.
   *
   * @param id ID of the user to be updated
   * @param role new role of the user
   */
  updateRole: (id: number, role: UserRoleUpdateRequestModel) => Promise<void>;

  /**
   * Updates the given user's profile.
   *
   * @param id ID of the user to be updated
   * @param profile new profile information
   */
  updateProfile: (id: number, profile: UserProfileUpdateRequestModel) => Promise<UserModel>;

  /**
   * Updates the given user's password.
   *
   * @param id ID of the user to be updated
   * @param password new password information
   */
  updatePassword: (id: number, password: PasswordChangeRequestModel) => Promise<void>;

  /**
   * Deletes the given user.
   *
   * @param id ID of the user to be deleted
   */
  deleteUserByID: (id: number) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling user management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const userService = (environment: APIEnvironment): UserService => {

  return {

    async getAllUsers(page: number = 0): Promise<SimplifiedPageModel<UserModel>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: UserPaths.USERS,
        queryParameters: { page }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async getUserByID(id: number): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: UserPaths.USERS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async createUser(user: UserCreationRequestModel): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: UserPaths.USERS,
        requestBody: user
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async enableUser(id: number): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: UserPaths.USERS_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async disableUser(id: number): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: UserPaths.USERS_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async updateRole(id: number, role: UserRoleUpdateRequestModel): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: UserPaths.USERS_BY_ID_ROLE,
        pathParameters: { id },
        requestBody: role
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async updateProfile(id: number, profile: UserProfileUpdateRequestModel): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.USERS_PROFILE,
        pathParameters: { id },
        requestBody: profile,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async updatePassword(id: number, password: PasswordRequestModel): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.USERS_PASSWORD,
        pathParameters: { id },
        requestBody: password,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async deleteUserByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.USERS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    }
  }
}
