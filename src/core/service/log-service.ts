import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { LogEventPage } from "@/core/model/logs";

enum LogProcessorPath {

  LOGS_V2 = "/v2/logs"
}

interface LogService {

  /**
   * Queries stored log message in TLP via TLPv2 API.
   *
   * @param query TLQL log query string
   */
  getLogs: (query: string) => Promise<LogEventPage>;
}

/**
 * Service implementation for Tiny Log Processor communication, handling log processing.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const logService = (environment: APIEnvironment): LogService => {

  return {

    getLogs(query: string): Promise<LogEventPage> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LogProcessorPath.LOGS_V2,
        requestBody: query,
        headers: {
          "Content-Type": "text/plain"
        }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.LOG_PROCESSOR, request);
    }
  }
}
