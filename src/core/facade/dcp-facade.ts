import { APIEnvironment } from "@/api-environment";
import { DCPDataModel, DCPRequestModel } from "@/core/model/dcp";
import dcpService from "@/core/service/dcp-service";

interface DCPFacade<T> {

  /**
   * Retrieves the contents of the DCP store and maps (a subset of) the parameters to a specific configuration domain,
   * using the given mapper function.
   *
   * @param mapperFunction configuration mapper function
   */
  retrieveConfiguration: (mapperFunction: (dcp: DCPDataModel[]) => T) => Promise<T>;

  /**
   * Updates the contents of the DCP store based on the given configuration domain instance and mapper function.
   *
   * @param config configuration domain instance
   * @param mapperFunction configuration mapper function
   */
  updateConfiguration: (config: T, mapperFunction: (config: T) => DCPRequestModel[]) => Promise<void>;

  /**
   * Utility function to extract a single configuration item from the current DCP store.
   *
   * @param dcp DCP store items
   * @param key key of an item to be extracted
   */
  extractItem: (dcp: DCPDataModel[], key: string) => string | undefined;
}

/**
 * Facade implementation coordinating DCP-backed configuration operations.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const dcpFacade = <T>(environment: APIEnvironment): DCPFacade<T> => {

  const { getAllDCPEntries, createDCPEntry, updateDCPEntry } = dcpService(environment);

  return {

    async retrieveConfiguration<T>(mapperFunction: (dcp: DCPDataModel[]) => T): Promise<T> {

      return getAllDCPEntries()
        .then(mapperFunction);
    },

    async updateConfiguration<T>(config: T, mapperFunction: (config: T) => DCPRequestModel[]): Promise<void> {

      const existingKeys = await getAllDCPEntries()
        .then(entries => entries.map(entry => entry.key));
      const requests = mapperFunction(config);
      for (const request of requests) {
        const operation = existingKeys.includes(request.key)
          ? updateDCPEntry
          : createDCPEntry;
        await operation(request);
      }

      return Promise.resolve();
    },

    extractItem(dcp: DCPDataModel[], key: string): string | undefined {
      return dcp.find(item => item.key === key)?.value;
    }
  }
}
