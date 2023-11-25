import { APIEnvironment } from "@/api-environment";
import { RESTRequest } from "@/core/domain/requests";
import axios, { AxiosResponse } from "axios";

/**
 * TODO.
 *
 * @param environment
 * @param request
 */
const baseRestClient = <T>(environment: APIEnvironment, request: RESTRequest): Promise<AxiosResponse<T>> => {

  const defaultHeaders: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json"
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
    data: request.requestBody
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
