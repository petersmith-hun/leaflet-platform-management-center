import {
  Deployment,
  DeploymentForm,
  DeploymentHealthcheck,
  DeploymentInfo,
  DockerArguments,
  ExecutionArgumentsForm,
  MapLikeObject,
  SourceType
} from "@/core/model/domino";
import ms from "ms";

/**
 * Maps the given Deployment object (retrieved from Domino) to DeploymentForm object (to populate deployment editor form).
 *
 * @param deployment contents of the deployment definition
 */
export const mapToDeploymentForm = (deployment?: Deployment): DeploymentForm => {

  if (!deployment) {
    return {
      healthcheck: { enabled: true },
      info: { enabled: true }
    } as DeploymentForm;
  }

  const healthcheck = deployment.healthcheck as DeploymentHealthcheck | undefined;
  const info = deployment.info as DeploymentInfo | undefined;

  return {
    id: deployment.id,
    source: deployment.source,
    target: {
      hosts: transformListToString(deployment.target.hosts)!,
    },
    healthcheck: {
      enabled: deployment.healthcheck.enabled,
      endpoint: healthcheck?.endpoint,
      delay: healthcheck?.delay ? ms(healthcheck.delay, { long: true }) : undefined,
      timeout: healthcheck?.timeout ? ms(healthcheck.timeout, { long: true }) : undefined,
      maxAttempts: `${healthcheck?.maxAttempts ?? ""}`,
    },
    execution: {
      via: deployment.execution.via,
      commandName: deployment.execution.commandName,
      asUser: deployment.execution.asUser,
      runtime: deployment.execution.runtime,
      args: deployment.source.type === SourceType.FILESYSTEM
        ? mapFilesystemExecutionArguments(deployment)
        : mapDockerExecutionArguments(deployment)
    },
    info: {
      enabled: deployment.info.enabled,
      endpoint: info?.endpoint,
      fieldMapping: transformMapToString(info?.fieldMapping),
    }
  };
}

const mapFilesystemExecutionArguments = (deployment: Deployment): ExecutionArgumentsForm => {

  return {
    commandLineArgs: transformListToString(deployment.execution.args as string[] | undefined),
  }
}

const mapDockerExecutionArguments = (deployment: Deployment): ExecutionArgumentsForm => {

  const dockerExecutionArgs = deployment.execution.args as DockerArguments | undefined;

  return {
    commandArgs: transformListToString(dockerExecutionArgs?.commandArgs),
    environment: transformMapToString(dockerExecutionArgs?.environment),
    networkMode: dockerExecutionArgs?.networkMode,
    ports: transformMapToString(dockerExecutionArgs?.ports),
    restartPolicy: dockerExecutionArgs?.restartPolicy,
    volumes: transformMapToString(dockerExecutionArgs?.volumes),
  }
}

const transformListToString = (input?: string[]): string | undefined => {

  if (!input) {
    return undefined;
  }

  return input.join("\n");
}

const transformMapToString = (input?: MapLikeObject): string | undefined => {

  if (!input) {
    return undefined;
  }

  return Object.entries(input)
    .map(entry => entry.join("->").replace(/\r?\n/, " "))
    .join("\n");
}
