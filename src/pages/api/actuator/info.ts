import applicationConfig from "@/application-config";
import { NextApiRequest, NextApiResponse } from "next";

const actuatorInfoResponse = {
  app: {
    name: applicationConfig.info.applicationName,
    abbreviation: applicationConfig.info.abbreviation
  },
  build: {
    version: applicationConfig.info.version,
    time: applicationConfig.info.buildTime
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
