import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { ResponseWrapper } from "@/core/model/common";
import { DocumentEditRequest, DocumentModel } from "@/core/model/document";

interface WrappedDocumentList {
  documents: DocumentModel[];
}

interface DocumentService {

  /**
   * Retrieves all existing documents.
   */
  getAllDocuments: () => Promise<DocumentModel[]>;

  /**
   * Retrieves a single document by its ID.
   *
   * @param id document ID
   */
  getDocumentByID: (id: number) => Promise<ResponseWrapper<DocumentModel>>;

  /**
   * Creates a new document.
   *
   * @param document document data to be submitted
   */
  createDocument: (document: DocumentEditRequest) => Promise<DocumentModel>;

  /**
   * Modifies an existing document.
   *
   * @param id ID of document to be updated
   * @param document document data to be submitted
   */
  updateDocument: (id: number, document: DocumentEditRequest) => Promise<DocumentModel>;

  /**
   * Flips the general status (enabled/disabled) of the given document.
   *
   * @param id ID of document to be updated
   */
  changeGeneralStatus: (id: number) => Promise<DocumentModel>;

  /**
   * Removes an existing document.
   *
   * @param id ID of document to be deleted
   */
  deleteDocumentByID: (id: number) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling documents management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
const documentService = (environment: APIEnvironment): DocumentService => {

  return {

    async getAllDocuments(): Promise<DocumentModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.DOCUMENTS,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedDocumentList>(environment, request)
        .then(response => response?.documents ?? []);
    },

    async getDocumentByID(id: number): Promise<ResponseWrapper<DocumentModel>> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.DOCUMENTS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async changeGeneralStatus(id: number): Promise<DocumentModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.DOCUMENTS_GENERAL_STATUS,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async createDocument(document: DocumentEditRequest): Promise<DocumentModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.DOCUMENTS,
        requestBody: document,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async updateDocument(id: number, document: DocumentEditRequest): Promise<DocumentModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.DOCUMENTS_BY_ID,
        pathParameters: { id },
        requestBody: document,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async deleteDocumentByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.DOCUMENTS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    }
  }
}

export default documentService;
