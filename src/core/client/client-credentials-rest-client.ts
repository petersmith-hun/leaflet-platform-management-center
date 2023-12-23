import { HostEnvironment } from "@/api-environment";
import applicationConfig from "@/application-config";
import baseRestClient from "@/core/client/base-rest-client";
import { getServiceToken } from "@/core/client/client-credentials-registry";
import { ExternalService } from "@/core/client/index";
import { RESTRequest } from "@/core/domain/requests";
import { AxiosResponse } from "axios";

/**
 * REST client implemented for server-to-server communication with the external services. Uses OAuth Client Credentials
 * flow for authorization.
 *
 * @param service identified external service name
 * @param request RESTRequest object containing the request parameters (will be forwarded to the external service)
 */
const clientCredentialsRestClient = async <T>(service: ExternalService, request: RESTRequest): Promise<AxiosResponse<T>> => {

  const serviceParameter = applicationConfig.services.clients[service];
  const hostEnvironment: HostEnvironment = { api: serviceParameter.host };
  request.authorization!.Authorization = `Bearer ${await getServiceToken(service)}`;

  return baseRestClient(hostEnvironment, request);
}

export default clientCredentialsRestClient;