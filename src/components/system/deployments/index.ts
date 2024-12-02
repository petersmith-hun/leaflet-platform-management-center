import { DockerExecutionType, FilesystemExecutionType, SourceType } from "@/core/model/domino";

/**
 * Translation labels deployment source and execution types.
 */
export const descriptionMapping = new Map<string, string>([
  [SourceType.DOCKER, "system.deployments.label.source.docker"],
  [SourceType.FILESYSTEM, "system.deployments.label.source.filesystem"],
  [DockerExecutionType.STANDARD, "system.deployments.label.execution.docker-standard"],
  [FilesystemExecutionType.EXECUTABLE, "system.deployments.label.execution.filesystem-executable"],
  [FilesystemExecutionType.RUNTIME, "system.deployments.label.execution.filesystem-runtime"],
  [FilesystemExecutionType.SERVICE, "system.deployments.label.execution.filesystem-service"]
]);
