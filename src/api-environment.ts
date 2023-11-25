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
  authorization: Record<string, string>;
}

/**
 * TODO.
 */
const environmentProperties = async (context: NextPageContext): Promise<{ props: APIEnvironment }> => {

  // @ts-ignore
  const session = await getServerSession(context.req, context.res, options);

  return {
    props: {
      api: requireParameter(process.env.LEAFLET_API),
      clientID: requireParameter(process.env.LEAFLET_LINK_CLIENT_ID),
      deviceID: uuidv5(requireParameter(session?.user?.name), uuidv5.URL),
      authorization: createAuthorizationHeader(session?.accessToken)
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
