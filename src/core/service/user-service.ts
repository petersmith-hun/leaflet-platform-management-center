import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import {
  PasswordChangeRequestModel,
  PasswordRequestModel,
  UserCreationRequestModel,
  UserModel,
  UserProfileUpdateRequestModel,
  UserRoleUpdateRequestModel
} from "@/core/model/user";

interface WrappedUserList {
  users: UserModel[];
}

interface UserService {

  /**
   * Retrieves all existing user.
   */
  getAllUsers: () => Promise<UserModel[]>;

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

    async getAllUsers(): Promise<UserModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.USERS,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedUserList>(environment, request)
        .then(response => response?.users ?? []);
    },

    async getUserByID(id: number): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.USERS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async createUser(user: UserCreationRequestModel): Promise<UserModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.USERS,
        requestBody: user,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async updateRole(id: number, role: UserRoleUpdateRequestModel): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.USERS_ROLE,
        pathParameters: { id },
        requestBody: role,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
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
