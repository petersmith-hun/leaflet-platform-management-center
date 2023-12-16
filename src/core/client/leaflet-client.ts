import { APIEnvironment } from "@/api-environment";
import baseRestClient from "@/core/client/base-rest-client";
import { RESTRequest } from "@/core/domain/requests";
import { ResponseWrapper } from "@/core/model/common";
import { signIn } from "next-auth/react";

/**
 * Supported Leaflet API paths.
 */
export enum LeafletPath {

  // -- articles --
  ARTICLE = "/entries",
  ARTICLE_BY_ID = "/entries/{id}",
  ARTICLE_SEARCH = "/entries/search",
  ARTICLE_GENERAL_STATUS = "/entries/{id}/status",
  ARTICLE_PUBLICATION_STATUS = "/entries/{id}/publication/{status}",

  // -- attachments --
  ATTACHMENTS = "/attachments",

  // -- categories --
  CATEGORY_ALL = "/categories",
  CATEGORY_BY_ID = "/categories/{id}",
  CATEGORY_GENERAL_STATUS = "/categories/{id}/status",

  // -- tags --
  TAGS_ALL = "/tags",
  TAGS_ASSIGN = "/tags/assign",
  TAGS_BY_ID = "/tags/{id}",
  TAGS_GENERAL_STATUS = "/tags/{id}/status",
}

/**
 * Leaflet API specific extension of the baseRestClient. Adds the client and device IDs, required by "Leaflet Link",
 * as well as ensures having an active access token for the API, by checking if the API environment configuration
 * contains a valid access token, and if not, redirects the user to the login screen.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param request RESTRequest object containing the request parameters
 * @param unwrap indicates "unwrapping" the wrapped responses (containing SEO and pagination parameters besides the requested data) before returning them
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
