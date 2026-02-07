import { PermissionModel } from "@/core/model/permission";

/**
 * Response model representing a role.
 */
export interface RoleModel {

  id: string;
  name: string;
  description: string;
  localDefault: boolean;
  externalDefault: boolean;
  enabled: boolean;
  created: string;
  lastModified: string;
  permissions: PermissionModel[];
}

/**
 * Request model for creating or editing a role.
 */
export interface RoleRequest {

  name: string;
  description: string;
}
