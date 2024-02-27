import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { DockerRegistryContent, DockerRepository } from "@/core/model/docker-registry";

interface RegistryBrowserService {

  /**
   * Retrieves list of configured Docker registries.
   */
  getConfiguredRegistries: () => Promise<Record<string, string>>;

  /**
   * Retrieves list of Docker repositories for the given registry.
   *
   * @param registryID ID of the registry to be listed
   */
  getDockerRepositories: (registryID: string) => Promise<DockerRegistryContent>;

  /**
   * Retrieves Docker repository details.
   *
   * @param registryID ID of the registry to be listed
   * @param repositoryID ID of the repository to be detailed
   */
  getDockerRepositoryTags: (registryID: string, repositoryID: string) => Promise<DockerRepository>;

  /**
   * Requests Docker image deletion.
   *
   * @param registryID ID of the registry to be listed
   * @param repositoryID ID of the repository to be detailed
   * @param tag tag of the image to be deleted
   */
  deleteDockerImageByTag: (registryID: string, repositoryID: string, tag: string) => Promise<void>;
}

enum RegistryPath {

  REGISTRY = "/registry",
  REGISTRY_REPOSITORIES = "/registry/{registryID}",
  REGISTRY_REPOSITORIES_TAGS = "/registry/{registryID}/{repositoryID}",
  REGISTRY_REPOSITORIES_TAGS_TAG = "/registry/{registryID}/{repositoryID}/{tag}"
}

/**
 * Service implementation for Leaflet Stack Admin Service communication, handling Docker Registry browser requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const registryBrowserService = (environment: APIEnvironment): RegistryBrowserService => {

  return {

    async getConfiguredRegistries(): Promise<Record<string, string>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: RegistryPath.REGISTRY
      });

      return baseServiceGatewayRestClient(environment as APIEnvironment, ExternalService.STACK_ADMIN_SERVICE, request);
    },

    async getDockerRepositories(registryID: string): Promise<DockerRegistryContent> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: RegistryPath.REGISTRY_REPOSITORIES,
        pathParameters: { registryID }
      });

      return baseServiceGatewayRestClient(environment as APIEnvironment, ExternalService.STACK_ADMIN_SERVICE, request);
    },

    async getDockerRepositoryTags(registryID: string, repositoryID: string): Promise<DockerRepository> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: RegistryPath.REGISTRY_REPOSITORIES_TAGS,
        pathParameters: { registryID, repositoryID }
      });

      return baseServiceGatewayRestClient(environment as APIEnvironment, ExternalService.STACK_ADMIN_SERVICE, request);
    },

    async deleteDockerImageByTag(registryID: string, repositoryID: string, tag: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: RegistryPath.REGISTRY_REPOSITORIES_TAGS_TAG,
        pathParameters: { registryID, repositoryID, tag }
      });

      return baseServiceGatewayRestClient(environment as APIEnvironment, ExternalService.STACK_ADMIN_SERVICE, request);
    }
  }
}
