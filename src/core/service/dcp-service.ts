import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { DCPDataModel, DCPRequestModel } from "@/core/model/dcp";

interface WrappedDCPDataModelList {
  dcpStore: DCPDataModel[];
}

interface DCPService {

  /**
   * Retrieves all existing DCP store item.
   */
  getAllDCPEntries: () => Promise<DCPDataModel[]>;

  /**
   * Creates a new configuration item in the DCP store.
   *
   * @param dcpEntry DCP item to be created
   */
  createDCPEntry: (dcpEntry: DCPRequestModel) => Promise<void>;

  /**
   * Updates an existing configuration item in the DCP store.
   *
   * @param dcpEntry DCP item to be updated
   */
  updateDCPEntry: (dcpEntry: DCPRequestModel) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling DCP store configuration requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
const dcpService = (environment: APIEnvironment): DCPService => {

  return {

    async getAllDCPEntries(): Promise<DCPDataModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.DCP,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedDCPDataModelList>(environment, request)
        .then(response => response.dcpStore);
    },

    async createDCPEntry(dcpEntry: DCPRequestModel): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.DCP,
        requestBody: dcpEntry,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async updateDCPEntry(dcpEntry: DCPRequestModel): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.DCP,
        requestBody: dcpEntry,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    }
  }
}

export default dcpService;
