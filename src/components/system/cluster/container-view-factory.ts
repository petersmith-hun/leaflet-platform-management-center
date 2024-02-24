import { defaultDetails, defaultStat } from "@/components/system/cluster/index";
import { Container, ContainerDetails, ContainerStats, ContainerView } from "@/core/model/cluster";

/**
 * Creates a ContainerView object containing all necessary data to render a container status card.
 *
 * @param container container base information
 * @param details container details (status, start time, etc.)
 * @param stats container stats (CPU and ram usage)
 */
export const createContainerView = (container: Container, details: Record<string, ContainerDetails>, stats: Record<string, ContainerStats>): ContainerView => {

  const containerDetails = extractItem(details, container.id, defaultDetails);
  const containerStats = extractItem(stats, container.id, defaultStat);
  const shortID = container.id.substring(0, 8);
  const image = container.image.startsWith("sha256:")
    ? `${container.image.substring(0, 15)}...`
    : container.image;

  return {
    id: shortID,
    image: image,
    name: container.names[0].substring(1),
    cpuUsagePercent: containerStats.cpuUsagePercent,
    memoryUsagePercent: containerStats.memoryUsagePercent,
    memoryUsageActual: containerStats.memoryUsageInMegabytes,
    status: containerDetails.status,
    startedAt: containerDetails.startedAt,
    logFilePath: containerDetails.logPath,
    logFilePathShort: containerDetails.logPath.replaceAll(container.id, `${shortID}...`)
  }
}

const extractItem = <T extends { id: string }>(items: Record<string, T>, id: string, defaultFunction: (id: string) => T): T => {

  return Object
    .values(items)
    .find(item => item.id === id) ?? defaultFunction(id);
}
