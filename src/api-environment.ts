import applicationConfig from "@/application-config";
import { ExternalService } from "@/core/client";
import { getServiceToken } from "@/core/client/client-credentials-registry";
import { options } from "@/pages/api/auth/[...nextauth]";
import { NextPageContext } from "next";
import { getServerSession, Session } from "next-auth";
import { v5 as uuidv5 } from 'uuid';

/**
 * Target API host parameters.
 */
export interface HostEnvironment {

  /**
   * Service host URL.
   */
  api: string,
}

/**
 * Target API environment parameters.
 */
export interface APIEnvironment extends HostEnvironment {

  /**
   * Leaflet Link client ID.
   */
  clientID: string;

  /**
   * Leaflet Link device ID.
   */
  deviceID: string;

  /**
   * Authorization header to be passed in the API requests.
   */
  authorization: Record<string, string> | null;

  /**
   * Root path of the published articles on the visitor frontend.
   */
  publicArticlePath: string;

  /**
   * Images resource server path for rendering images in article previews.
   */
  resourceServer: string;
}

/**
 * LSAS API environment parameters.
 */
export interface ClusterMonitoringAPIEnvironment extends HostEnvironment {

  /**
   * Authorization header to verify the admin user session.
   */
  authorization: Record<string, string> | null;

  /**
   * Authorization header for LSAS streaming connections.
   */
  monitoringAuthorization?: Record<string, string>;
}

/**
 * Parameters passed directly to a page component.
 */
export interface ScreenParameters {
  environment: APIEnvironment;
}

/**
 * Generates the server side properties needed by the pages communicating with Leaflet.
 *
 * @param context NextPageContext object containing the HTTP request and response objects
 */
const environmentProperties = async (context: NextPageContext): Promise<{ props: APIEnvironment | object }> => {

  // @ts-ignore
  const session = await getServerSession(context.req, context.res, options);

  if (isTokenExpired(session)) {
    return { props: {} };
  }

  return {
    props: {
      api: requireParameter(process.env.LEAFLET_API),
      clientID: requireParameter(process.env.LEAFLET_LINK_CLIENT_ID),
      deviceID: uuidv5(requireParameter(session?.user?.name), uuidv5.URL),
      authorization: createAuthorizationHeader(session?.accessToken),
      publicArticlePath: requireParameter(process.env.PUBLIC_ARTICLE_PATH),
      resourceServer: requireParameter(process.env.RESOURCE_SERVER)
    }
  }
}

/**
 * Generates the server side properties needed by the cluster monitoring pages (communicating with LSAS).
 *
 * @param context NextPageContext object containing the HTTP request and response objects
 */
export const monitoringEnvironmentProperties = async (context: NextPageContext): Promise<{ props: ClusterMonitoringAPIEnvironment | object }> => {

  // @ts-ignore
  const session = await getServerSession(context.req, context.res, options);

  if (isTokenExpired(session)) {
    return { props: {} };
  }

  const lsasJSConfig = applicationConfig.services.clients.lsas_js;
  const lsasJSToken = await getServiceToken(ExternalService.STACK_ADMIN_SERVICE_JS);

  return {
    props: {
      api: requireParameter(lsasJSConfig.host),
      authorization: createAuthorizationHeader(session?.accessToken),
      monitoringAuthorization: createAuthorizationHeader(lsasJSToken)
    }
  }
}

const isTokenExpired = (session: Session | null): boolean => {
  return new Date(session?.expiresAt ?? 0).getTime() < new Date().getTime();
}

const requireParameter = (parameter?: string | null): string => {

  const value = parameter;
  if (!value) {
    throw new Error("Missing API environment parameter");
  }

  return value;
}

const createAuthorizationHeader = (accessToken?: string): Record<string, string> => {

  return {
    Authorization: `Bearer ${requireParameter(accessToken)}`
  }
}

export default environmentProperties;
