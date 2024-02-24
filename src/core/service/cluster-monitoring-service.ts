import { APIEnvironment, ClusterMonitoringAPIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { Container, ContainerDetails, ContainerStats } from "@/core/model/cluster";
import { createObservable } from "@/core/util/observable-factory";
import { Observable } from "rxjs";

interface ClusterMonitoringService {

  /**
   * Retrieves list of existing Docker containers.
   */
  getContainers: () => Promise<Container[]>;

  /**
   * Returns detailed information about the specified containers as streaming data.
   *
   * @param containerIDs list of container IDs as provided by Docker
   * @param abortController AbortController instance to request stopping the data stream
   */
  getContainerDetails: (containerIDs: string[], abortController: AbortController) => Observable<ContainerDetails>;

  /**
   * Returns statistics about the specified containers as streaming data.
   *
   * @param containerIDs list of container IDs as provided by Docker
   * @param abortController AbortController instance to request stopping the data stream
   */
  getContainerStats: (containerIDs: string[], abortController: AbortController) => Observable<ContainerStats>;
}

enum MonitoringPath {

  CONTAINERS = "/containers",
  CONTAINERS_STATS = "/containers/stats",
  CONTAINERS_DETAILS = "/containers/details"
}

/**
 * Service implementation for Leaflet Stack Admin Service communication, handling live cluster information requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const clusterMonitoringService = (environment: ClusterMonitoringAPIEnvironment): ClusterMonitoringService => {

  const setupSubscription = <T>(path: string, containerIDs: string[], abortController: AbortController): Observable<T> => {

    return createObservable(() => fetch(`${environment.api}${path}?ids=${containerIDs.join(",")}`, {
      headers: {
        ...environment.monitoringAuthorization,
        Accept: "text/event-stream"
      },
      signal: abortController.signal
    }));
  }

  return {

    async getContainers(): Promise<Container[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: MonitoringPath.CONTAINERS
      });

      return baseServiceGatewayRestClient(environment as APIEnvironment, ExternalService.STACK_ADMIN_SERVICE, request);
    },

    getContainerDetails(containerIDs: string[], abortController: AbortController): Observable<ContainerDetails> {
      return setupSubscription(MonitoringPath.CONTAINERS_DETAILS, containerIDs, abortController);
    },

    getContainerStats(containerIDs: string[], abortController: AbortController): Observable<ContainerStats> {
      return setupSubscription(MonitoringPath.CONTAINERS_STATS, containerIDs, abortController);
    }
  }
}
