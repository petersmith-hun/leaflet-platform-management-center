import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";
import { MapLikeObject } from "@/core/model/domino";
import { GroupedSecretMetadataModel, SecretCreationRequest, SecretMetadataModel } from "@/core/model/secrets";

enum SecretManagerPath {

  SECRETS = "/secrets",
  SECRETS_KEY = "/secrets/{key}",
  SECRETS_KEY_METADATA = "/secrets/{key}/metadata",
  SECRETS_KEY_RETRIEVAL = "/secrets/{key}/retrieval"
}

interface SecretService {

  /**
   * Retrieves the meta information of all existing secret. Secrets in the response are grouped by their context value.
   */
  getAllSecretMetadata: () => Promise<GroupedSecretMetadataModel[]>;

  /**
   * Retrieves the meta information of the given secret.
   *
   * @param key key of the secret to retrieve
   */
  getSecretMetadata: (key: string) => Promise<SecretMetadataModel>;

  /**
   * Retrieves the given secret.
   *
   * @param key key of the secret to retrieve
   */
  getSecret: (key: string) => Promise<MapLikeObject>;

  /**
   * Creates a new secret.
   *
   * @param secretCreationRequest contents of the secret to be stored
   */
  createSecret: (secretCreationRequest: SecretCreationRequest) => Promise<void>;

  /**
   * Enables/disables retrieval of the given secret.
   *
   * @param key key of the secret to enable/disable retrieval of
   * @param current current secret metadata to extract current retrieval status
   */
  switchRetrieval: (key: string, current: SecretMetadataModel) => Promise<IdentifiedSelfStatusAwareModel<string>>;

  /**
   * Deletes the given secret.
   *
   * @param key key of the secret to delete
   */
  deleteSecret: (key: string) => Promise<void>;
}

/**
 * Service implementation for Domino Secret Manager communication, handling secrets.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const secretService = (environment: APIEnvironment): SecretService => {

  return {

    async getAllSecretMetadata(): Promise<GroupedSecretMetadataModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: SecretManagerPath.SECRETS
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    async getSecretMetadata(key: string): Promise<SecretMetadataModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: SecretManagerPath.SECRETS_KEY_METADATA,
        pathParameters: { key }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    async getSecret(key: string): Promise<MapLikeObject> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: SecretManagerPath.SECRETS_KEY,
        pathParameters: { key }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    async createSecret(secretCreationRequest: SecretCreationRequest): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: SecretManagerPath.SECRETS,
        requestBody: secretCreationRequest
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    async switchRetrieval(key: string, current: SecretMetadataModel): Promise<IdentifiedSelfStatusAwareModel<string>> {

      const request = new RESTRequest({
        method: current.retrievable
          ? RequestMethod.DELETE
          : RequestMethod.PUT,
        path: SecretManagerPath.SECRETS_KEY_RETRIEVAL,
        pathParameters: { key }
      });

      await baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);

      // @ts-ignore
      return { id: key, enabled: !current.retrievable }
    },

    async deleteSecret(key: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: SecretManagerPath.SECRETS_KEY,
        pathParameters: { key }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    }
  }
}
