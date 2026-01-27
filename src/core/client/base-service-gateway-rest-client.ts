import { APIEnvironment, HostEnvironment } from "@/api-environment";
import baseRestClient from "@/core/client/base-rest-client";
import { ExternalService } from "@/core/client/index";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { signIn } from "next-auth/react";

const encodeRequest = (request: RESTRequest): string => {

  return Buffer
    .from(JSON.stringify(request), "utf-8")
    .toString("base64");
}
/**
 * REST client for issuing external service calls via the service gateway (/api/service-gateway endpoint).
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param service identified external service name
 * @param request RESTRequest object containing the request parameters (will be forwarded to the external service)
 */
export const baseServiceGatewayRestClient = async <T>(environment: APIEnvironment, service: ExternalService, request: RESTRequest): Promise<T> => {

  if (!environment.authorization) {
    await signIn();
  }

  const hostEnvironment: HostEnvironment = {
    api: `/api/service-gateway/${service}/`
  }

  const bundledRequest = new RESTRequest({
    method: RequestMethod.POST,
    path: "/",
    requestBody: {
      originalRequest: encodeRequest(request)
    }
  });

  return baseRestClient(hostEnvironment, bundledRequest)
    .then(response => response.data)
    .then(data => data as Promise<T>);
}
