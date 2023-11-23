import applicationInfo from "@/application-info";
import { NextApiRequest, NextApiResponse } from "next";

const actuatorInfoResponse = {
  app: {
    name: applicationInfo.applicationName,
    abbreviation: applicationInfo.abbreviation
  },
  build: {
    version: applicationInfo.version,
    time: applicationInfo.buildTime
  }
}

/**
 * Returns the running application's info.
 *
 * @param request NextApiRequest object
 * @param response NextApiResponse object
 */
export default function handler(request: NextApiRequest, response: NextApiResponse<typeof actuatorInfoResponse>) {

  if (request.method !== "GET") {
    throw new Error("Unsupported request method");
  }

  response.status(200).json(actuatorInfoResponse)
}
