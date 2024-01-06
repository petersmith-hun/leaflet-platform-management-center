import { ExternalService } from "@/core/client";
import { ApplicationConfig } from "@/core/domain/config";

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
      [ExternalService.RESOURCE_SERVER]: {
        host: process.env.SERVICE_LSRS_HOST as string,
        audience: process.env.SERVICE_LSRS_AUDIENCE as string,
        clientID: process.env.SERVICE_LSRS_CLIENT_ID as string,
        clientSecret: process.env.SERVICE_LSRS_CLIENT_SECRET as string,
        scope: (process.env.SERVICE_LSRS_SCOPE as string ?? "").split(","),
        requireUserScope: process.env.SERVICE_LSRS_REQUIRED_USER_SCOPE as string
      }
    }
  }
}

export default applicationConfig;
