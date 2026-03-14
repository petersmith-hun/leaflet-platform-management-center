import applicationConfig from "@/application-config";
import { getRequiredSession } from "@/core/support/service-gateway/proxy-api-utilities";
import { NextApiRequest, NextApiResponse } from "next";

const profileManagementURL = `${applicationConfig.oauth.authorizationServerURL}${applicationConfig.oauth.profileManagementPath}`;

/**
 * Handles redirecting the user to the profile management interface of the integrated OAuth Authorization Server.
 *
 * @param request NextApiRequest object
 * @param response NextApiResponse object
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {

  await getRequiredSession(request, response);

  if (request.method !== "GET") {
    throw new Error("Unsupported request method");
  }

  response
    .status(302)
    .setHeader("Location", profileManagementURL)
    .end();
}