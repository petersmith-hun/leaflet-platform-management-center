import { ExternalService } from "@/core/client";
import clientCredentialsRestClient from "@/core/client/client-credentials-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { ExternalServiceCallError } from "@/core/support/service-gateway";
import {
  assertPermission,
  getRequestPath,
  getRequiredSession,
  getTargetService
} from "@/core/support/service-gateway/proxy-api-utilities";
import { getProxyRequestBodyAdapter } from "@/core/support/service-gateway/proxy-request-adapters";
import { AxiosError, AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const forwardRequest = async (requestPath: string[], request: NextApiRequest, service: ExternalService): Promise<AxiosResponse<unknown>> => {

  const targetPath = requestPath.slice(1);
  const adapter = getProxyRequestBodyAdapter(request);
  const restRequest = new RESTRequest({
    method: request.method as RequestMethod,
    path: targetPath.join("/"),
    requestBody: request.body
      ? adapter(request.body)
      : undefined
  });

  return await clientCredentialsRestClient(service, restRequest);
};

/**
 * Increased request size limit for file uploads.
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  }
}

/**
 * Handles calls from the UI to be forwarded to background services (not available via public API).
 * Expects the name of a known service as the first path variable, the rest of the path fill be passed as is to the
 * targeted service.
 *
 * @param request NextApiRequest object
 * @param response NextApiResponse object
 */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {

  try {
    const session: Session = await getRequiredSession(request, response);
    const requestPath = await getRequestPath(request);
    const service: ExternalService = await getTargetService(requestPath);
    await assertPermission(service, session);

    const result = await forwardRequest(requestPath, request, service);
    response.status(200).json(result.data);

  } catch (error: any) {

    let status = 500;
    const errorResponse = { message: error?.message };
    if (error instanceof ExternalServiceCallError) {
      status = error.statusCode;
    }

    if (error instanceof AxiosError && error.response) {
      status = error.response.status;
    }

    response.status(status).send(errorResponse);
  }
}
