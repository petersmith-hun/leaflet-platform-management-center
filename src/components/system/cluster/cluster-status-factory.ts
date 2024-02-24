import { createContainerView } from "@/components/system/cluster/container-view-factory";
import {
  ClusterStatus,
  Container,
  ContainerDetails,
  ContainerStats,
  ContainerStatus,
  ContainerView
} from "@/core/model/cluster";

/**
 * Creates a ClusterStatus object containing ContainerView objects for each registered container, and the cluster summary information.
 *
 * @param containers container base information for all registered container
 * @param details container details (status, start time, etc.) for all registered container
 * @param stats container stats (CPU and ram usage) for all registered container
 */
export const createClusterStatus = (containers: Container[], details: Record<string, ContainerDetails>, stats: Record<string, ContainerStats>): ClusterStatus => {

  const containerViews: ContainerView[] = containers
    .map(container => createContainerView(container, details, stats))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    containers: containerViews,
    countAll: countItems(containerViews),
    countStopped: countItems(containerViews, container => container.status !== ContainerStatus.RUNNING),
    totalCPUUsagePercentage: sumUsage(containerViews, container => container.cpuUsagePercent),
    totalRAMUsageMB: sumUsage(containerViews, container => container.memoryUsageActual),
    totalRAMUsagePercentage: sumUsage(containerViews, container => container.memoryUsagePercent)
  }
}

const sumUsage = (containerViews: ContainerView[], dataFunction: (containerView: ContainerView) => number): number => {

  return containerViews
    .map(dataFunction)
    .reduce((left, right) => left + right, 0.0);
}

const countItems = (containerViews: ContainerView[], filter: (containerView: ContainerView) => boolean = () => true): number => {

  return containerViews
    .filter(filter)
    .length;
}
