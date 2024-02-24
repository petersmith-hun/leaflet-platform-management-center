import { ClusterMonitoringAPIEnvironment } from "@/api-environment";
import { Container, ContainerDetails, ContainerStats } from "@/core/model/cluster";
import { clusterMonitoringService } from "@/core/service/cluster-monitoring-service";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Observable } from "rxjs";

interface DockerMonitoringState {

  setDetails: Dispatch<SetStateAction<Record<string, ContainerDetails>>>;
  setStats: Dispatch<SetStateAction<Record<string, ContainerStats>>>;
}

interface ClusterMonitoringFacade {

  /**
   * Triggers live cluster monitoring streams based on the list of registered containers. Also attaches an abort
   * controller to the streams, and starts listening to route-change-start event, so when the user moves on to another
   * page, the streams are interrupted.
   *
   * @param state React state update methods to set live data on UI
   */
  startDockerMonitoring(state: DockerMonitoringState): void;
}

/**
 * Facade implementation for live cluster monitoring operations.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param router Router instance to listen to navigation events
 * @param containers list of registered containers
 */
export const clusterMonitoringFacade = (environment: ClusterMonitoringAPIEnvironment, router: NextRouter, containers: Container[]): ClusterMonitoringFacade => {

  const { getContainerDetails, getContainerStats } = clusterMonitoringService(environment);

  const subscribe = <T extends { id: string }>(observable: Observable<T>, stateUpdater: Dispatch<SetStateAction<Record<string, T>>>): void => {

    observable.subscribe(container => {
      stateUpdater(item => {
        item[container.id] = container;
        return Object.assign({}, item);
      });
    });
  }

  return {

    startDockerMonitoring(state: DockerMonitoringState): void {

      const abortController = new AbortController();
      const containerIDs = containers.map(container => container.id);

      subscribe(getContainerDetails(containerIDs, abortController), state.setDetails);
      subscribe(getContainerStats(containerIDs, abortController), state.setStats);

      router.events.on("routeChangeStart", () => abortController.abort());
    }
  }
}
