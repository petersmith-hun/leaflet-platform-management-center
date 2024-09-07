import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { ResponseWrapper } from "@/core/model/common";
import { Deployment, DeploymentSummary } from "@/core/model/domino";

enum DominoPath {

  DEPLOYMENTS = "/deployments",
  DEPLOYMENTS_BY_ID = "/deployments/{id}",
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
    }
  }
}
