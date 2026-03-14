import { ExternalService } from "@/core/client";
import { ApplicationConfig, ExternalServiceParameters } from "@/core/domain/config";

const createClientConfig = (service: ExternalService): ExternalServiceParameters => {

  const servicePrefix = service.toUpperCase();

  return {
    clientID: process.env[`OAUTH_CLIENT_ID`] as string,
    clientSecret: process.env[`OAUTH_CLIENT_SECRET`] as string,
    host: process.env[`SERVICE_${servicePrefix}_HOST`] as string,
    audience: process.env[`SERVICE_${servicePrefix}_AUDIENCE`] as string,
    scope: (process.env[`SERVICE_${servicePrefix}_SCOPE`] as string ?? "").split(","),
    requireUserScope: process.env[`SERVICE_${servicePrefix}_REQUIRED_USER_SCOPE`] as string
  }
}

/**
 * Main server configuration provider.
 */
const applicationConfig: ApplicationConfig = {
  oauth: {
    id: process.env.OAUTH_ID as string,
    name: process.env.OAUTH_NAME as string,
    authorizationServerURL: process.env.OAUTH_AUTHORIZATION_SERVER_URL as string,
    clientID: process.env.OAUTH_CLIENT_ID as string,
    clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    audience: process.env.OAUTH_AUDIENCE as string,
    profileManagementPath: process.env.OAUTH_PROFILE_MANAGEMENT_PATH as string
  },
  services: {
    authorizerHost: process.env.SERVICE_AUTH_AUTHORIZER_HOST as string,
    tokenPath: process.env.SERVICE_AUTH_TOKEN_PATH as string,
    clients: {
      [ExternalService.RESOURCE_SERVER]: createClientConfig(ExternalService.RESOURCE_SERVER),
      [ExternalService.LOG_PROCESSOR]: createClientConfig(ExternalService.LOG_PROCESSOR),
      [ExternalService.TRANSLATION_MANAGER]: createClientConfig(ExternalService.TRANSLATION_MANAGER),
      [ExternalService.STACK_ADMIN_SERVICE]: createClientConfig(ExternalService.STACK_ADMIN_SERVICE),
      [ExternalService.STACK_ADMIN_SERVICE_JS]: createClientConfig(ExternalService.STACK_ADMIN_SERVICE_JS),
      [ExternalService.FAILOVER]: createClientConfig(ExternalService.FAILOVER),
      [ExternalService.DOMINO]: createClientConfig(ExternalService.DOMINO),
      [ExternalService.ACCESS_GATEWAY]: createClientConfig(ExternalService.ACCESS_GATEWAY)
    }
  }
}

export default applicationConfig;
