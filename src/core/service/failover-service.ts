import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { FailoverStatusResponse } from "@/core/model/failover";

interface FailoverService {

  /**
   * Retrieves the current status of CBFS.
   */
  getFailoverStatus: () => Promise<FailoverStatusResponse>;
}

enum FailoverPath {
  STATUS = "/status"
}

/**
 * Service implementation for Content Backup Failover System communication, handling CBFS status requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const failoverService = (environment: APIEnvironment): FailoverService => {

  return {

    async getFailoverStatus(): Promise<FailoverStatusResponse> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: FailoverPath.STATUS,
        authorization: environment.authorization!
      });

      return baseServiceGatewayRestClient(environment, ExternalService.FAILOVER, request);
    }
  }
}
