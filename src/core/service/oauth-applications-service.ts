import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { SimplifiedPageModel } from "@/core/model/common";
import {
  OAuthApplicationModel,
  OAuthApplicationRegistrationRequest,
  OAuthApplicationRegistrationResponse,
  OAuthApplicationSummaryModel
} from "@/core/model/oauth";

enum OAuthApplicationPaths {
  APPLICATIONS = "/access-management/oauth-applications",
  APPLICATIONS_BY_ID = "/access-management/oauth-applications/{id}",
  APPLICATIONS_BY_ID_STATUS = "/access-management/oauth-applications/{id}/status",
  APPLICATIONS_BY_ID_SECRET = "/access-management/oauth-applications/{id}/secret"
}

interface OAuthApplicationService {

  /**
   * Retrieves the given page of OAuth application registrations for listing (summary only).
   *
   * @param page 1-based page number
   */
  getAllApplications(page?: number): Promise<SimplifiedPageModel<OAuthApplicationSummaryModel>>;

  /**
   * Retrieves the details of the given OAuth application registration.
   *
   * @param id application ID
   */
  getApplicationByID(id: string): Promise<OAuthApplicationModel>;

  /**
   * Creates a new OAuth application registration.
   *
   * @param application OAuth application data
   */
  createApplication(application: OAuthApplicationRegistrationRequest): Promise<OAuthApplicationRegistrationResponse>;

  /**
   * Edits an existing OAuth application registration.
   *
   * @param id ID of the OAuth application to update
   * @param application OAuth application data
   */
  editApplication(id: string, application: OAuthApplicationRegistrationRequest): Promise<OAuthApplicationRegistrationResponse>;

  /**
   * Regenerates the OAuth client secret of the given application.
   *
   * @param id ID of the OAuth application to regenerate secret of
   */
  regenerateApplicationSecret(id: string): Promise<OAuthApplicationRegistrationResponse>;

  /**
   * Enables the given OAuth application.
   *
   * @param id ID of OAuth application to be updated
   */
  enableApplication: (id: string) => Promise<OAuthApplicationModel>;

  /**
   * Disables the given OAuth application.
   *
   * @param id ID of OAuth application to be updated
   */
  disableApplication: (id: string) => Promise<OAuthApplicationModel>;

  /**
   * Removes an existing Oauth application.
   *
   * @param id ID of OAuth application to be deleted
   */
  deleteApplicationByID: (id: string) => Promise<void>;
}

/**
 * Service implementation for LAGS API communication, handling OAuth application registrations.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const oauthApplicationService = (environment: APIEnvironment): OAuthApplicationService => {

  return {

    async getAllApplications(page: number = 0): Promise<SimplifiedPageModel<OAuthApplicationSummaryModel>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: OAuthApplicationPaths.APPLICATIONS,
        queryParameters: { page }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async getApplicationByID(id: string): Promise<OAuthApplicationModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: OAuthApplicationPaths.APPLICATIONS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async createApplication(application: OAuthApplicationRegistrationRequest): Promise<OAuthApplicationRegistrationResponse> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: OAuthApplicationPaths.APPLICATIONS,
        requestBody: application
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async editApplication(id: string, application: OAuthApplicationRegistrationRequest): Promise<OAuthApplicationRegistrationResponse> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: OAuthApplicationPaths.APPLICATIONS_BY_ID,
        pathParameters: { id },
        requestBody: application
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async regenerateApplicationSecret(id: string): Promise<OAuthApplicationRegistrationResponse> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: OAuthApplicationPaths.APPLICATIONS_BY_ID_SECRET,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async enableApplication(id: string): Promise<OAuthApplicationModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: OAuthApplicationPaths.APPLICATIONS_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async disableApplication(id: string): Promise<OAuthApplicationModel> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: OAuthApplicationPaths.APPLICATIONS_BY_ID_STATUS,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    },

    async deleteApplicationByID(id: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: OAuthApplicationPaths.APPLICATIONS_BY_ID,
        pathParameters: { id }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.ACCESS_GATEWAY, request);
    }
  }
}
