import {
  Deployment,
  DeploymentForm,
  DockerArguments,
  ExecutionArgumentsForm,
  MapLikeObject,
  OptionalDeploymentHealthcheck,
  OptionalDeploymentInfo,
  SourceType
} from "@/core/model/domino";
import ms, { StringValue } from "ms";

/**
 * Maps the given DeploymentForm object (form representation) to Deployment object (to be submitted to Domino).
 *
 * @param deploymentForm contents of the deployment editor form
 */
export const mapToDeployment = (deploymentForm: DeploymentForm): Deployment => {

  return {
    id: deploymentForm.id,
    source: deploymentForm.source,
    target: {
      hosts: transformStringToList(deploymentForm.target.hosts)!
    },
    execution: {
      via: deploymentForm.execution.via,
      commandName: deploymentForm.execution.commandName,
      runtime: deploymentForm.execution.runtime,
      asUser: deploymentForm.execution.asUser,
      args: deploymentForm.source.type === SourceType.DOCKER
        ? mapDockerArguments(deploymentForm)
        : transformStringToList(deploymentForm.execution.args?.commandLineArgs)
    },
    healthcheck: deploymentForm.healthcheck.enabled
      ? mapHealthcheck(deploymentForm)
      : { enabled: false },
    info: deploymentForm.info.enabled
      ? transformInfo(deploymentForm)
      : { enabled: false },
  }
}

const mapDockerArguments = (deploymentForm: DeploymentForm): DockerArguments => {

  const dockerArguments = deploymentForm.execution.args as ExecutionArgumentsForm;

  return {
    commandArgs: transformStringToList(dockerArguments.commandArgs),
    environment: transformStringToMap(dockerArguments.environment),
    networkMode: dockerArguments.networkMode,
    ports: transformStringToMap(dockerArguments.ports),
    restartPolicy: dockerArguments.restartPolicy,
    volumes: transformStringToMap(dockerArguments.volumes)
  }
}

const mapHealthcheck = (deploymentForm: DeploymentForm): OptionalDeploymentHealthcheck => {

  return {
    enabled: true,
    endpoint: deploymentForm.healthcheck.endpoint!,
    delay: ms(deploymentForm.healthcheck.delay! as StringValue),
    timeout: ms(deploymentForm.healthcheck.timeout! as StringValue),
    maxAttempts: parseInt(deploymentForm.healthcheck.maxAttempts!)
  }
}

const transformInfo = (deploymentForm: DeploymentForm): OptionalDeploymentInfo => {

  return {
    enabled: true,
    endpoint: deploymentForm.info.endpoint!,
    fieldMapping: transformStringToMap(deploymentForm.info.fieldMapping)!
  }
}


const transformStringToMap = (input?: string): MapLikeObject | undefined => {

  if (!input) {
    return undefined;
  }

  const entries = transformStringToList(input)!
    .map(item => item
      .split("->")
      .map(component => component.trim()));

  return Object.fromEntries(entries);
}

const transformStringToList = (input?: string): string[] | undefined => {

  if (!input) {
    return undefined;
  }

  return input.split(/\r?\n/);
}
