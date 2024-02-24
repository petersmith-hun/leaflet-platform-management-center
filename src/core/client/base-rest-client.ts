import { HostEnvironment } from "@/api-environment";
import { RESTRequest } from "@/core/domain/requests";
import axios, { AxiosResponse } from "axios";

/**
 * Generic, Axios-backed REST client implementation. Adds the Accept and Content-Type headers by default (both set to
 * application/json), as well deals with the resolution of the parameterized paths, besides setting up any other
 * provided parameter in the Axios request configuration object.
 *
 * @param environment HostEnvironment object defining the target API configuration
 * @param request RESTRequest object containing the request parameters
 */
const baseRestClient = <T>(environment: HostEnvironment, request: RESTRequest): Promise<AxiosResponse<T>> => {

  const defaultHeaders: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": request.requestBody instanceof FormData
      ? "multipart/form-data"
      : "application/json"
  };

  const headers: Record<string, string> = {
    ... defaultHeaders,
    ... request.headers,
    ... request.authorization
  };

  return axios.request({
    baseURL: environment.api,
    url: resolvePath(request),
    method: request.method,
    headers: headers,
    params: request.queryParameters,
    data: request.requestBody,
    responseType: request.streaming
      ? "stream"
      : "json"
  });
}

const resolvePath = (request: RESTRequest): string => {

  let path = request.path;

  if (!request.pathParameters) {
    return path;
  }

  for (const [key, value] of Object.entries(request.pathParameters)) {
    path = path.replace(`{${key}}`, value as string);
  }

  return path;
}

export default baseRestClient;
