import { APIEnvironment } from "@/api-environment";
import { ExternalService } from "@/core/client";
import { baseServiceGatewayRestClient } from "@/core/client/base-service-gateway-rest-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import {
  DirectoryCreationRequestModel,
  FileDataModel,
  FileMetadataUpdateRequestModel, FileUploadProxyRequest, FileUploadRequest,
  VFSBrowserModel
} from "@/core/model/files";

enum ResourceServerPath {

  FILES = "/files",
  FILES_BROWSE = "/files/browse/{path}",
  FILES_ONLY_UUID = "/files/{pathUUID}",
  FILES_DIRECTORIES = "/files/directories"
}

interface FileService {

  /**
   * Retrieves the contents of the VFS under the given path.
   *
   * @param path VFS path
   */
  browse: (path: string) => Promise<VFSBrowserModel>;

  /**
   * Retrieves detailed file information.
   *
   * @param pathUUID ID of file to be deleted
   */
  getFileDetails: (pathUUID: string) => Promise<FileDataModel>;

  /**
   * Creates a new directory under given parent directory.
   *
   * @param directory model containing directory information
   */
  createDirectory: (directory: DirectoryCreationRequestModel) => Promise<void>;

  /**
   * Uploads a new file. Since the file is first submitted to the service gateway, which does not support
   * multipart/form-data requests, the file is converted to Base64 representation, then a request adapter will convert
   * it multipart/form-data before sending it over to LSRS.
   *
   * @param file data of the file to upload and additional data wrapped as FileUploadRequest
   */
  uploadFile: (file: FileUploadRequest) => Promise<FileDataModel>;

  /**
   * Updates given file's meta information.
   *
   * @param pathUUID ID of file to be deleted
   * @param updatedMetadata updated meta information
   */
  updateFileMetadata: (pathUUID: string, updatedMetadata: FileMetadataUpdateRequestModel) => Promise<FileDataModel>;

  /**
   * Removes an existing file.
   *
   * @param pathUUID ID of file to be deleted
   */
  deleteFileByPathUUID: (pathUUID: string) => Promise<void>;
}

/**
 * Service implementation for Leaflet Static Resource Server communication, handling file resources.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const fileService = (environment: APIEnvironment): FileService => {

  return {

    async browse(path: string): Promise<VFSBrowserModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: ResourceServerPath.FILES_BROWSE,
        pathParameters: { path }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.RESOURCE_SERVER, request);
    },

    async getFileDetails(pathUUID: string): Promise<FileDataModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: ResourceServerPath.FILES_ONLY_UUID,
        pathParameters: { pathUUID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.RESOURCE_SERVER, request);
    },

    async createDirectory(directory: DirectoryCreationRequestModel): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: ResourceServerPath.FILES_DIRECTORIES,
        requestBody: directory
      });

      return baseServiceGatewayRestClient(environment, ExternalService.RESOURCE_SERVER, request);
    },

    async uploadFile(file: FileUploadRequest): Promise<FileDataModel> {

      const fileToUpload = file.inputFile[0];

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: ResourceServerPath.FILES,
        requestBody: {
          subFolder: file.subFolder,
          description: file.description,
          inputFile: {
            mimeType: fileToUpload.type,
            name: fileToUpload.name,
            size: fileToUpload.size,
            content: Buffer.from(await fileToUpload.arrayBuffer()).toString("base64")
          }
        } as FileUploadProxyRequest
      });

      return baseServiceGatewayRestClient(environment, ExternalService.RESOURCE_SERVER, request);
    },

    async updateFileMetadata(pathUUID: string, updatedMetadata: FileMetadataUpdateRequestModel): Promise<FileDataModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: ResourceServerPath.FILES_ONLY_UUID,
        pathParameters: { pathUUID },
        requestBody: updatedMetadata
      });

      return baseServiceGatewayRestClient(environment, ExternalService.RESOURCE_SERVER, request);
    },

    async deleteFileByPathUUID(pathUUID: string): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: ResourceServerPath.FILES_ONLY_UUID,
        pathParameters: { pathUUID }
      });

      return baseServiceGatewayRestClient(environment, ExternalService.RESOURCE_SERVER, request);
    }
  }
}
