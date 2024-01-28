import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { FrontEndRouteDataModel, FrontEndRouteRequestModel } from "@/core/model/routes";

interface WrappedRouteList {
  routes: FrontEndRouteDataModel[];
}

interface RoutesService {

  /**
   * Retrieves all existing frontend routes.
   */
  getAllRoutes(): Promise<FrontEndRouteDataModel[]>;

  /**
   * Retrieves a single frontend route by its ID.
   *
   * @param id route ID
   */
  getRouteByID(id: number): Promise<FrontEndRouteDataModel>;

  /**
   * Creates a new frontend route.
   *
   * @param route route data to be submitted
   */
  createRoute: (route: FrontEndRouteRequestModel) => Promise<FrontEndRouteDataModel>;

  /**
   * Modifies an existing frontend route.
   *
   * @param id ID of route to be updated
   * @param route route data to be submitted
   */
  updateRoute: (id: number, route: FrontEndRouteRequestModel) => Promise<FrontEndRouteDataModel>;

  /**
   * Flips the general status (enabled/disabled) of the given frontend route.
   *
   * @param id ID of route to be updated
   */
  changeGeneralStatus: (id: number) => Promise<FrontEndRouteDataModel>;

  /**
   * Removes an existing frontend route.
   *
   * @param id ID of route to be deleted
   */
  deleteRouteByID: (id: number) => Promise<void>;
}


/**
 * Service implementation for Leaflet API communication, handling frontend routing management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const routesService = (environment: APIEnvironment): RoutesService => {

  return {

    async getAllRoutes(): Promise<FrontEndRouteDataModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.ROUTES,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedRouteList>(environment, request)
        .then(response => response?.routes ?? []);
    },

    async getRouteByID(id: number): Promise<FrontEndRouteDataModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.ROUTES_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async createRoute(route: unknown): Promise<FrontEndRouteDataModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.ROUTES,
        requestBody: route,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async updateRoute(id: number, route: unknown): Promise<FrontEndRouteDataModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.ROUTES_BY_ID,
        pathParameters: { id },
        requestBody: route,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async changeGeneralStatus(id: number): Promise<FrontEndRouteDataModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.ROUTES_GENERAL_STATUS,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async deleteRouteByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.ROUTES_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    }
  }
}
