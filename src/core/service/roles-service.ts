import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { SimplifiedPageModel } from "@/core/model/common";
import { RoleModel, RoleRequest } from "@/core/model/role";

enum RolePaths {
  ROLES = "/access-management/roles",
  ROLES_BY_ID = "/access-management/roles/{id}",
  ROLES_BY_ID_STATUS = "/access-management/roles/{id}/status",
  ROLES_BY_ID_LOCAL_DEFAULT = "/access-management/roles/{id}/local-default",
  ROLES_BY_ID_EXTERNAL_DEFAULT = "/access-management/roles/{id}/external-default",
  ROLES_BY_ID_ASSIGNMENT = "/access-management/roles/{roleID}/permissions/{permissionID}",
}

interface RoleService {

  /**
   * Retrieves the given page of roles.
   *
   * @param page 1-based page number
   */
  getAllRoles(page?: number): Promise<SimplifiedPageModel<RoleModel>>;

  /**
   * Retrieves the details of the given role.
   *
   * @param id role ID
   */
  getRoleByID(id: string): Promise<RoleModel>;

  /**
   * Creates a new role.
   *
   * @param role role data
   */
  createRole(role: RoleRequest): Promise<RoleModel>;

  /**
   * Edits an existing role.
   *
   * @param id ID of the role to update
   * @param role role data
   */
  editRole(id: string, role: RoleRequest): Promise<RoleModel>;

  /**
   * Enables the given role.
   *
   * @param id ID of role to be updated
   */
  enableRole: (id: string) => Promise<RoleModel>;

  /**
   * Disables the given role.
   *
   * @param id ID of role to be updated
   */
  disableRole: (id: string) => Promise<RoleModel>;

  /**
   * Marks the given role as default for locally registered users.
   *
   * @param id ID of role to be updated
   */
  markAsLocalDefault: (id: string) => Promise<RoleModel>;

  /**
   * Marks the given role as default for externally registered users.
   *
   * @param id ID of role to be updated
   */
  markAsExternalDefault: (id: string) => Promise<RoleModel>;

  /**
   * Assigns the given permission to the given role.
   *
   * @param roleID role ID
   * @param permissionID ID of the permission to assign
   */
  assignPermission: (roleID: string, permissionID: string) => Promise<RoleModel>;

  /**
   * Unassigns the given permission from the given role.
   *
   * @param roleID role ID
   * @param permissionID ID of the permission to assign
   */
  unassignPermission: (roleID: string, permissionID: string) => Promise<RoleModel>;

  /**
   * Removes an existing role.
   *
   * @param id ID of role to be deleted
   */
  deleteRoleByID: (id: string) => Promise<void>;
}

/**
 * Service implementation for LAGS API communication, handling roles.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const roleService = (environment: APIEnvironment): RoleService => {

  return {

    async getAllRoles(page: number = 0): Promise<SimplifiedPageModel<RoleModel>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: RolePaths.ROLES,
        queryParameters: { page }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async getRoleByID(id: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: RolePaths.ROLES_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async createRole(role: RoleRequest): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: RolePaths.ROLES,
        requestBody: role
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async editRole(id: string, role: RoleRequest): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: RolePaths.ROLES_BY_ID,
        requestBody: role,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async enableRole(id: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: RolePaths.ROLES_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async disableRole(id: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: RolePaths.ROLES_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async markAsLocalDefault(id: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: RolePaths.ROLES_BY_ID_LOCAL_DEFAULT,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async markAsExternalDefault(id: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: RolePaths.ROLES_BY_ID_EXTERNAL_DEFAULT,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async assignPermission(roleID: string, permissionID: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: RolePaths.ROLES_BY_ID_ASSIGNMENT,
        pathParameters: { roleID, permissionID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async unassignPermission(roleID: string, permissionID: string): Promise<RoleModel> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: RolePaths.ROLES_BY_ID_ASSIGNMENT,
        pathParameters: { roleID, permissionID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async deleteRoleByID(id: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: RolePaths.ROLES_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    }
  }
}
