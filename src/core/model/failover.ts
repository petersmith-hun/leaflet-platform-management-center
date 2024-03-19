/**
 * Possible failover statuses.
 */
export enum FailoverStatus {

  /**
   * Application is currently creating content mirror.
   */
  MIRRORING = "MIRRORING",

  /**
   * Failed to retrieve mirror.
   */
  MIRRORING_FAILURE = "MIRRORING_FAILURE",

  /**
   * Application is in standby mode, currently not serving traffic.
   */
  STANDBY = "STANDBY",

  /**
   * Application is serving live traffic.
   */
  SERVING = "SERVING"
}

/**
 * Possible mirror types.
 *
 * @author Peter Smith
 */
export enum MirrorType {

  /**
   * All mirrors (for logging Leaflet unavailability).
   */
  ALL = "ALL",

  /**
   * Category list mirror.
   */
  CATEGORY = "CATEGORY",

  /**
   * Document list mirror.
   */
  DOCUMENT = "DOCUMENT",

  /**
   * Entry list mirror.
   */
  ENTRY = "ENTRY",

  /**
   * Entry page (categorized and non-categorized altogether) mirror.
   */
  ENTRY_PAGE = "ENTRY_PAGE"
}

/**
 * Mirroring result containing mirror type and number of processed records.
 */
export interface MirrorStatus {

  mirrorType: MirrorType;
  numberOfRecords: number;
}

/**
 * Model object for status tracking entries.
 */
export interface StatusEntry {

  created: string;
  status: FailoverStatus;
  parameter: string;
}

/**
 * Domain object for CBFS status requests.
 */
export interface FailoverStatusResponse {

  status: FailoverStatus;
  lastCall: string;
  lastMirroring: string;
  mirrorStatus: MirrorStatus[];
  statusEntryList: StatusEntry[];
}
