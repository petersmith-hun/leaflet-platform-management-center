/**
 * Secret attributes for retrieval, including all secret fields, except for the stored value.
 */
export interface SecretMetadataModel {
  key: string;
  value: string;
  context: string;
  retrievable: boolean;
  lastAccessedBy?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response model for returning a group of secrets by context.
 */
export interface GroupedSecretMetadataModel {
  context: string;
  secrets: SecretMetadataModel[];
}

/**
 * Request model for creating a secret.
 */
export interface SecretCreationRequest {
  key: string;
  value: string;
  context: string;
}
