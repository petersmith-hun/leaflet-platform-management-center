import { HostEnvironment } from "@/api-environment";
import applicationConfig from "@/application-config";
import baseRestClient from "@/core/client/base-rest-client";
import { ExternalService } from "@/core/client/index";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { AxiosResponse } from "axios";

interface TokenResponse {

  access_token: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {

  accessToken: string;
  expiresAt: number;
}

const expirationThresholdInMS = 300_000;
const tokenCache: { [key in ExternalService]?: CachedToken } = {};

const requiresRenewal = (service: ExternalService) => {
  return !tokenCache?.[service] || tokenCache[service]!.expiresAt < new Date().getTime() - expirationThresholdInMS;
}

const createTokenRequest = (service: ExternalService): RESTRequest => {

  const serviceConfig = applicationConfig.services.clients[service];

  const tokenForm = new FormData();
  tokenForm.set("grant_type", "client_credentials");
  tokenForm.set("scope", serviceConfig.scope.join(" "));
  tokenForm.set("client_id", serviceConfig.clientID);

  const tokenRequestBasicCredentials = Buffer
    .from(`${serviceConfig.clientID}:${serviceConfig.clientSecret}`)
    .toString("base64");

  return new RESTRequest({
    method: RequestMethod.POST,
    path: applicationConfig.services.tokenPath,
    queryParameters: {
      "audience": serviceConfig.audience
    },
    requestBody: tokenForm,
    authorization: {
      Authorization: `Basic ${tokenRequestBasicCredentials}`
    }
  });
};

/**
 * Helper implementation able to generate and provide an OAuth Client Credentials access token for the given external
 * service. The implementation caches the generated tokens and also checks for expiration, requesting a new token only
 * when necessary.
 *
 * @param service identified external service name
 */
export const getServiceToken = async (service: ExternalService): Promise<string> => {

  if (requiresRenewal(service)) {

    const lagsHostEnvironment: HostEnvironment = { api: applicationConfig.services.authorizerHost };
    const tokenRequest = createTokenRequest(service);
    const tokenResponse: AxiosResponse<TokenResponse> = await baseRestClient(lagsHostEnvironment, tokenRequest);

    tokenCache[service] = {
      accessToken: tokenResponse.data.access_token,
      expiresAt: new Date().getTime() + (tokenResponse.data.expires_in * 1000)
    }
  }

  return tokenCache[service]!.accessToken;
}
