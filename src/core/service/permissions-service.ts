import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { SimplifiedPageModel } from "@/core/model/common";
import { PermissionModel, PermissionRequest } from "@/core/model/permission";

enum PermissionPaths {
  PERMISSIONS = "/access-management/permissions",
  PERMISSIONS_BY_ID = "/access-management/permissions/{id}",
  PERMISSIONS_BY_ID_STATUS = "/access-management/permissions/{id}/status"
}

interface PermissionService {

  /**
   * Retrieves the given page of permissions.
   *
   * @param page 1-based page number
   */
  getAllPermissions(page?: number): Promise<SimplifiedPageModel<PermissionModel>>;

  /**
   * Retrieves the details of the given permission.
   *
   * @param id permission ID
   */
  getPermissionByID(id: string): Promise<PermissionModel>;

  /**
   * Creates a new permission.
   *
   * @param permission permission data
   */
  createPermission(permission: PermissionRequest): Promise<PermissionModel>;

  /**
   * Edits an existing permission.
   *
   * @param id ID of the permission to update
   * @param permission permission data
   */
  editPermission(id: string, permission: PermissionRequest): Promise<PermissionModel>;

  /**
   * Enables the given permission.
   *
   * @param id ID of permission to be updated
   */
  enablePermission: (id: string) => Promise<PermissionModel>;

  /**
   * Disables the given permission.
   *
   * @param id ID of permission to be updated
   */
  disablePermission: (id: string) => Promise<PermissionModel>;

  /**
   * Removes an existing permission.
   *
   * @param id ID of permission to be deleted
   */
  deletePermissionByID: (id: string) => Promise<void>;
}

/**
 * Service implementation for LAGS API communication, handling permissions.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const permissionService = (environment: APIEnvironment): PermissionService => {

  return {

    async getAllPermissions(page: number = 0): Promise<SimplifiedPageModel<PermissionModel>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: PermissionPaths.PERMISSIONS,
        queryParameters: { page }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async getPermissionByID(id: string): Promise<PermissionModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: PermissionPaths.PERMISSIONS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async createPermission(permission: PermissionRequest): Promise<PermissionModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: PermissionPaths.PERMISSIONS,
        requestBody: permission
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async editPermission(id: string, permission: PermissionRequest): Promise<PermissionModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: PermissionPaths.PERMISSIONS_BY_ID,
        requestBody: permission,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async enablePermission(id: string): Promise<PermissionModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: PermissionPaths.PERMISSIONS_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async disablePermission(id: string): Promise<PermissionModel> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: PermissionPaths.PERMISSIONS_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async deletePermissionByID(id: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: PermissionPaths.PERMISSIONS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    }
  }
}
