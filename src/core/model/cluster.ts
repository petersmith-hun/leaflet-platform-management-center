/**
 * Response object representing the base information of a container.
 */
export interface Container {

  id: string;
  image: string;
  names: string[];
  state: string;
}

/**
 * Response object representing the statistics of a container.
 */
export interface ContainerStats {

  id: string;
  cpuUsagePercent: number;
  memoryUsageInMegabytes: number;
  memoryUsagePercent: number;
}

/**
 * Supported container statuses.
 */
export enum ContainerStatus {

  CREATED = "CREATED",
  RESTARTING = "RESTARTING",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  EXITED = "EXITED",
  DEAD = "DEAD",
  UNKNOWN = "UNKNOWN"
}

/**
 * Response object representing the details of a container.
 */
export interface ContainerDetails {

  id: string;
  status: ContainerStatus;
  logPath: string;
  startedAt: string;
}

/**
 * Domain object representing the processed data set of a container.
 */
export interface ContainerView {

  id: string;
  image: string;
  name: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  memoryUsageActual: number;
  status: ContainerStatus;
  startedAt: string;
  logFilePath: string;
  logFilePathShort: string;
}

/**
 * Domain object wrapping the processed ContainerView objects and the overall cluster summary.
 */
export interface ClusterStatus {

  containers: ContainerView[];
  countAll: number;
  countStopped: number;
  totalRAMUsageMB: number;
  totalRAMUsagePercentage: number;
  totalCPUUsagePercentage: number;
}
