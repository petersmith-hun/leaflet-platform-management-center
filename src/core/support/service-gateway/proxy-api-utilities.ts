import applicationConfig from "@/application-config";
import { ExternalService } from "@/core/client";
import { Permission } from "@/core/domain/auth";
import { ExternalServiceCallError } from "@/core/support/service-gateway/index";
import { options } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";

const extractAsserted = async <T>(dataSupplier: () => Promise<T | undefined | null> | T | undefined | null,
                                  assertion: (data: T | undefined | null) => boolean,
                                  errorSupplier: () => ExternalServiceCallError): Promise<T> => {

  const result = await dataSupplier();
  if (!assertion(result)) {
    throw errorSupplier();
  }

  return result!;
}

/**
 * Extracts the mandatory session information on the server side, before forwarding the request to the external service.
 * Throws an HTTP 401 Unauthorized error if the session is not available.
 *
 * @param request NextApiRequest object to extract server side session data
 * @param response NextApiResponse object to extract server side session data
 */
export const getRequiredSession = async (request: NextApiRequest, response: NextApiResponse): Promise<Session> => {

  return await extractAsserted(
    () => getServerSession(request, response, options),
    data => data !== undefined,
    () => new ExternalServiceCallError("Unauthenticated", 401));
}

/**
 * Extracts the request path of the proxy call. Must be at least one segment long, as the first segment is always
 * expected to be the target service ID. Throws an HTTP 400 Bad Request error if the request path does not contain at
 * least one segment.
 *
 * @param request NextApiRequest object to extract request information (request path) from
 */
export const getRequestPath = async (request: NextApiRequest): Promise<string[]> => {

  return await extractAsserted(
    () => request.query.path as string[],
    data => Array.isArray(data) && data.length > 0,
    () => new ExternalServiceCallError("Invalid request path", 400));
}

/**
 * Extracts the target service ID from the request path. Throws an HTTP 400 Bad Request error if the identifier does
 * not reference a known external service.
 *
 * @param requestPath request path (expectedly) including the external service ID
 */
export const getTargetService = async (requestPath: string[]): Promise<ExternalService> => {

  return await extractAsserted(
    () => requestPath[0] as ExternalService,
    data => Object.values(ExternalService).includes(data!),
    () => new ExternalServiceCallError("Unidentified external service", 400));
}

/**
 * Asserts that the current local user has the necessary minimum permission for accessing the external service, throws
 * an HTTP 403 Forbidden error otherwise.
 *
 * @param service identified external service name
 * @param session server side session object, containing information about the active local user
 */
export const assertPermission = async (service: ExternalService, session: Session): Promise<void> => {

  await extractAsserted(
    () => applicationConfig.services.clients[service],
    data => data!.requireUserScope === undefined || session.scope.includes(data!.requireUserScope as Permission),
    () => new ExternalServiceCallError("Unauthorized", 403));
}
