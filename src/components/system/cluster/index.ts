import { Container, ContainerDetails, ContainerStats, ContainerStatus } from "@/core/model/cluster";

/**
 * Creates a default ContainerStatus object, setting all utilization value to 0.
 *
 * @param id ID of the container to create the stats object for
 */
export const defaultStat = (id: string): ContainerStats => {
  return { id, cpuUsagePercent: 0, memoryUsagePercent: 0, memoryUsageInMegabytes: 0 };
};

/**
 * Creates a default ContainerDetails object, setting log path and started date to empty string, and the status to unknown.
 *
 * @param id ID of the container to create the details object for
 */
export const defaultDetails = (id: string): ContainerDetails => {
  return { id, logPath: "", startedAt: "", status: ContainerStatus.UNKNOWN };
};

/**
 * Creates a default record object to render the default, empty container cards.
 *
 * @param containers registered containers
 * @param defaultFunction function to generate default entries in the record
 */
export const defaultState = <T>(containers: Container[], defaultFunction: (id: string) => T): Record<string, T> => {
  return Object.fromEntries(containers.map(container => [container.id, defaultFunction(container.id)]))
}
