import { APIEnvironment } from "@/api-environment";
import axiosResponseHandler from "@/core/client/axios-response-handler";
import baseRestClient from "@/core/client/base-rest-client";
import { RESTRequest } from "@/core/domain/requests";
import { ResponseWrapper } from "@/core/model/common";

/**
 * TODO.
 */
export enum LeafletPath {

  ARTICLE_BY_ID = "/entries/{id}",
  ARTICLE_SEARCH = "/entries/search"
}

/**
 * TODO.
 * @param environment
 * @param request
 * @param unwrap
 */
const leafletClient = <T>(environment: APIEnvironment, request: RESTRequest, unwrap: boolean = false): Promise<T> => {

  request.headers!["X-Device-ID"] = environment.deviceID;
  request.headers!["X-Client-ID"] = environment.clientID;

  return baseRestClient(environment, request)
    .then(axiosResponseHandler)
    .then(data => unwrap
      ? (data as ResponseWrapper<T>).body
      : data) as Promise<T>;
}

export default leafletClient;
