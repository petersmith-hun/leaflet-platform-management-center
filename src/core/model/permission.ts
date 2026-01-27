
/**
 * Response model representing a permission.
 */
export interface PermissionModel {

  id: string;
  name: string;
  description: string;
  enabled: boolean;
  created: string;
  lastModified: string;
}

/**
 * Request model for creating or editing a permission.
 */
export interface PermissionRequest {

  name: string;
  description: string;
}
