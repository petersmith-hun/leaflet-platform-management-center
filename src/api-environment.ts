import { options } from "@/pages/api/auth/[...nextauth]";
import { NextPageContext } from "next";
import { getServerSession } from "next-auth";
import { v5 as uuidv5 } from 'uuid';

/**
 * TODO.
 */
export interface APIEnvironment {
  api: string,
  clientID: string;
  deviceID: string;
  authorization: Record<string, string> | null;
  publicArticlePath: string;
  resourceServer: string;
}

/**
 * TODO.
 */
export interface ScreenParameters {
  environment: APIEnvironment;
}

/**
 * TODO.
 */
const environmentProperties = async (context: NextPageContext): Promise<{ props: APIEnvironment | object }> => {

  // @ts-ignore
  const session = await getServerSession(context.req, context.res, options);
  const tokenExpiresAt = new Date(session?.expiresAt ?? 0).getTime();

  if (tokenExpiresAt < new Date().getTime()) {
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
