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
  }
}

export default applicationConfig;
