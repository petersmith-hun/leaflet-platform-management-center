import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { ResponseWrapper } from "@/core/model/common";
import { Deployment, DeploymentExport, DeploymentSummary } from "@/core/model/domino";

enum DominoPath {

  DEPLOYMENTS = "/deployments",
  DEPLOYMENTS_BY_ID = "/deployments/{id}",
  DEPLOYMENTS_BY_ID_UNLOCK = "/deployments/{id}/unlock",
}

interface DominoService {

  /**
   * Retrieves a page of all registered deployments (API defaults to 10 items per page).
   *
   * @param page page number
   */
  getDeployments: (page: number) => Promise<ResponseWrapper<DeploymentSummary[]>>;

  /**
   * Retrieves the details of a specific deployment.
   *
   * @param id ID of the deployment to retrieve details of
   */
  getDeployment: (id: string) => Promise<Deployment>;

  /**
   * Retrieves the details of a specific deployment in YAML format.
   *
   * @param id ID of the deployment to export
   */
  exportDeployment: (id: string) => Promise<DeploymentExport>;

  /**
   * Creates a new deployment definition.
   *
   * @param deployment deployment definition to be created
   */
  createDeployment: (deployment: Deployment) => Promise<Deployment>;

  /**
   * Updates an existing deployment definition.
   *
   * @param id ID of the deployment to update
   * @param deployment updated deployment definition
   */
  updateDeployment: (id: string, deployment: Omit<Deployment, "id">) => Promise<Deployment>;

  /**
   * Unlocks an existing, imported deployment definition.
   *
   * @param id ID of the deployment to unlock
   */
  unlockDeployment: (id: string) => Promise<void>;

  /**
   * Deletes an existing deployment definition.
   *
   * @param id ID of the deployment to delete
   */
  deleteDeployment: (id: string) => Promise<void>;
}

/**
 * Service implementation for Domino communication, handling deployment definitions.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const dominoService = (environment: APIEnvironment): DominoService => {

  return {

    getDeployments(page: number): Promise<ResponseWrapper<DeploymentSummary[]>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: DominoPath.DEPLOYMENTS,
        queryParameters: { pageNumber: page }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    getDeployment(id: string): Promise<Deployment> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: DominoPath.DEPLOYMENTS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    exportDeployment(id: string): Promise<DeploymentExport> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: DominoPath.DEPLOYMENTS_BY_ID,
        pathParameters: { id },
        queryParameters: { yaml: true }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    createDeployment(deployment: Deployment): Promise<Deployment> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: DominoPath.DEPLOYMENTS,
        requestBody: deployment
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    updateDeployment(id: string, deployment: Omit<Deployment, "id">): Promise<Deployment> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: DominoPath.DEPLOYMENTS_BY_ID,
        pathParameters: { id },
        requestBody: deployment
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    unlockDeployment(id: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: DominoPath.DEPLOYMENTS_BY_ID_UNLOCK,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },

    deleteDeployment(id: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: DominoPath.DEPLOYMENTS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.DOMINO, request);
    },
  }
}
