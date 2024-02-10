import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { TranslationPack, TranslationPackCreationRequest, TranslationPackMetaInfo } from "@/core/model/translations";

enum TranslationServicePath {

  TRANSLATIONS = "/translations",
  TRANSLATIONS_BY_ID = "/translations/{packID}",
  TRANSLATIONS_STATUS = "/translations/{packID}/status"
}

interface TranslationService {

  /**
   * Retrieves the meta information of all existing translation packs.
   */
  getPacks(): Promise<TranslationPackMetaInfo[]>;

  /**
   * Retrieves a single translation pack by its ID.
   *
   * @param packID translation pack ID
   */
  getPackByID(packID: string): Promise<TranslationPack>;

  /**
   * Creates a new translation pack.
   *
   * @param route route data to be submitted
   */
  createPack: (pack: TranslationPackCreationRequest) => Promise<TranslationPack>;

  /**
   * Flips the general status (enabled/disabled) of the given translation pack.
   *
   * @param id ID of translation pack to be updated
   */
  changeGeneralStatus: (packID: string) => Promise<TranslationPack>;

  /**
   * Removes an existing translation pack.
   *
   * @param id ID of translation pack to be deleted
   */
  deletePackByID: (packID: string) => Promise<void>;
}

/**
 * Service implementation for Translation Management Service communication, handling translation packs.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const translationService = (environment: APIEnvironment): TranslationService => {

  return {

    async getPacks(): Promise<TranslationPackMetaInfo[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: TranslationServicePath.TRANSLATIONS
      });

      return baseServiceGatewayRestClient(environment, ExternalService.TRANSLATION_MANAGER, request);
    },

    async getPackByID(packID: string): Promise<TranslationPack> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: TranslationServicePath.TRANSLATIONS_BY_ID,
        pathParameters: { packID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.TRANSLATION_MANAGER, request);
    },

    async createPack(pack: TranslationPackCreationRequest): Promise<TranslationPack> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: TranslationServicePath.TRANSLATIONS,
        requestBody: pack
      });

      return baseServiceGatewayRestClient(environment, ExternalService.TRANSLATION_MANAGER, request);
    },

    async changeGeneralStatus(packID: string): Promise<TranslationPack> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: TranslationServicePath.TRANSLATIONS_STATUS,
        pathParameters: { packID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.TRANSLATION_MANAGER, request);
    },

    async deletePackByID(packID: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: TranslationServicePath.TRANSLATIONS_BY_ID,
        pathParameters: { packID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.TRANSLATION_MANAGER, request);
    }
  }
}
