import { APIEnvironment } from "@/api-environment";
import baseRestClient from "@/core/client/base-rest-client";
import { RESTRequest } from "@/core/domain/requests";
import { ResponseWrapper } from "@/core/model/common";
import { signIn } from "next-auth/react";

/**
 * TODO.
 */
export enum LeafletPath {

  ARTICLE = "/entries",
  ARTICLE_BY_ID = "/entries/{id}",
  ARTICLE_SEARCH = "/entries/search",
  ARTICLE_GENERAL_STATUS = "/entries/{id}/status",
  ARTICLE_PUBLICATION_STATUS = "/entries/{id}/publication/{status}",

  ATTACHMENTS = "/attachments",

  CATEGORY_ALL = "/categories",

  TAGS_ALL = "/tags",
  TAGS_ASSIGN = "/tags/assign"
}

/**
 * TODO.
 * @param environment
 * @param request
 * @param unwrap
 */
const leafletClient = async <T>(environment: APIEnvironment, request: RESTRequest, unwrap: boolean = false): Promise<T> => {

  if (!environment.authorization) {
    await signIn();
  }

  request.headers!["X-Device-ID"] = environment.deviceID;
  request.headers!["X-Client-ID"] = environment.clientID;

  return baseRestClient(environment, request)
    .then(response => response.data)
    .then(data => unwrap
      ? (data as ResponseWrapper<T>).body
      : data) as Promise<T>;
}

export default leafletClient;
