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
  version: string;
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

/**
 * Response object containing the list of abbreviations of the registered services.
 */
export interface RegisteredServices {

  registeredServices: string[];
}

/**
 * Response object containing the basic information of a registered service.
 */
export interface ServiceInfo {

  name: string;
  abbreviation: string;
}

/**
 * Response object containing the build information of a registered service.
 */
export interface BuildInfo {

  time: string;
  version: string;
}

/**
 * Response object wrapping a registered service's basic and build information, as well as its overall status.
 */
export interface ServiceStatus {

  app: ServiceInfo;
  build: BuildInfo;
  up: boolean | "polling";
}

/**
 * Domain object containing status summary of the registered services.
 */
export interface ServiceStatusSummary {

  countAll: number;
  countNotResponding: number;
}
