/**
 * Supported filesystem based execution types.
 */
export enum FilesystemExecutionType {

  EXECUTABLE = "executable",
  SERVICE = "service",
  RUNTIME = "runtime"
}

/**
 * Supported Docker execution types.
 */
export enum DockerExecutionType {

  STANDARD = "standard"
}

/**
 * Combined type for all supported execution type.
 */
export type ExecutionType = DockerExecutionType | FilesystemExecutionType;

/**
 * Supported source types.
 */
export enum SourceType {

  DOCKER = "docker",
  FILESYSTEM = "filesystem"
}

/**
 * Deployment source configuration parameters.
 */
export interface DeploymentSource {

  type: SourceType;
  home: string;
  resource: string;
}

/**
 * Deployment target configuration parameters.
 */
export interface DeploymentTarget {

  hosts: string[];
}

/**
 * Type alias for map-like object parameters (similar to string-string maps).
 */
export type MapLikeObject = { [key: string]: string }

/**
 * Docker execution configuration parameters.
 */
export interface DockerArguments {

  commandArgs?: string[];
  environment?: MapLikeObject;
  volumes?: MapLikeObject;
  ports?: MapLikeObject;
  restartPolicy?: string;
  networkMode?: string;
  custom?: object;
}

/**
 * General deployment execution configuration parameters.
 */
export interface DeploymentExecution {

  commandName: string;
  asUser?: string;
  via: ExecutionType;
  runtime?: string;
  args?: string[] | DockerArguments;
}

/**
 * Deployment info configuration parameters.
 */
export interface DeploymentInfo {

  endpoint: string;
  fieldMapping: MapLikeObject;
}

/**
 * Deployment healthcheck configuration parameters.
 */
export interface DeploymentHealthcheck {

  endpoint: string;
  delay: number;
  timeout: number;
  maxAttempts: number;
}

/**
 * Base type for matching enabled optional operations.
 */
export type EnabledDeploymentOperation = { enabled: true };

/**
 * Base type for matching disabled optional operations.
 */
export type DisabledDeploymentOperation = { enabled: false };

/**
 * DeploymentInfo configuration combined with the enabled/disabled flag.
 */
export type OptionalDeploymentInfo = (EnabledDeploymentOperation & DeploymentInfo) | DisabledDeploymentOperation;

/**
 * DeploymentHealthcheck configuration combined with the enabled/disabled flag.
 */
export type OptionalDeploymentHealthcheck = (EnabledDeploymentOperation & DeploymentHealthcheck) | DisabledDeploymentOperation;

/**
 * Deployment configuration mapping a complete deployment entry..
 */
export interface Deployment {

  id: string;
  source: DeploymentSource;
  target: DeploymentTarget;
  execution: DeploymentExecution;
  healthcheck: OptionalDeploymentHealthcheck;
  info: OptionalDeploymentInfo;
  metadata?: {
    locked: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}

/**
 * Basic information of a deployment.
 */
export interface DeploymentSummary {

  id: string;
  sourceType: SourceType;
  executionType: ExecutionType;
  home: string;
  resource: string;
  locked: boolean;
}

/**
 * Response model for YAML-formatted deployment definition exports. Response is still formatted as JSON, the definition
 * itself is returned in the "definition" field as YAML-formatted string.
 */
export interface DeploymentExport {
  definition: string;
}

/**
 * Execution arguments part of the form representation for deployment definition editor.
 */
export interface ExecutionArgumentsForm {

  commandLineArgs?: string;
  commandArgs?: string;
  environment?: string;
  volumes?: string;
  ports?: string;
  restartPolicy?: string;
  networkMode?: string;
}

/**
 * Form representation for deployment definition editor.
 */
export interface DeploymentForm {

  id: string;
  source: DeploymentSource;
  target: {
    hosts: string;
  };
  execution: {
    commandName: string;
    via: ExecutionType;
    asUser?: string;
    runtime?: string;
    args?: ExecutionArgumentsForm;
  };
  healthcheck: {
    enabled: boolean;
    endpoint?: string;
    delay?: string;
    timeout?: string;
    maxAttempts?: string;
  };
  info: {
    enabled: boolean;
    endpoint?: string;
    fieldMapping?: string;
  };
}
