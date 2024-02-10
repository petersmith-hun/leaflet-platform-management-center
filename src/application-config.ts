import { ExternalService } from "@/core/client";
import { ApplicationConfig, ExternalServiceParameters } from "@/core/domain/config";

const createClientConfig = (service: ExternalService): ExternalServiceParameters => {

  const servicePrefix = service.toUpperCase();

  return {
    host: process.env[`SERVICE_${servicePrefix}_HOST`] as string,
    audience: process.env[`SERVICE_${servicePrefix}_AUDIENCE`] as string,
    clientID: process.env[`SERVICE_${servicePrefix}_CLIENT_ID`] as string,
    clientSecret: process.env[`SERVICE_${servicePrefix}_CLIENT_SECRET`] as string,
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
    audience: process.env.OAUTH_AUDIENCE as string
  },
  services: {
    authorizerHost: process.env.SERVICE_AUTH_AUTHORIZER_HOST as string,
    tokenPath: process.env.SERVICE_AUTH_TOKEN_PATH as string,
    clients: {
      [ExternalService.RESOURCE_SERVER]: createClientConfig(ExternalService.RESOURCE_SERVER),
      [ExternalService.LOG_PROCESSOR]: createClientConfig(ExternalService.LOG_PROCESSOR),
      [ExternalService.TRANSLATION_MANAGER]: createClientConfig(ExternalService.TRANSLATION_MANAGER),
    }
  }
}

export default applicationConfig;
