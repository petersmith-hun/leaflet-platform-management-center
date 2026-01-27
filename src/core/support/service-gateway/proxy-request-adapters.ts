import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { FileUploadProxyRequest } from "@/core/model/files";

/**
 * Converts the given FileUploadProxyRequest object to a multipart/form-data request object. As per the current
 * implementation, the file to be uploaded must be converted to Base64 before submitting it to the service gateway
 * endpoint. However, the backing API (provided by LSRS) expects the data to be passed as multipart/form-data - this
 * conversion is done by this implementation.
 *
 * @param data input data as FileUploadProxyRequest
 */
const convertBase64ImageToFormData = (data: FileUploadProxyRequest): FormData => {

  const fileData = Buffer.from(data.inputFile.content as string, "base64");

  const formData = new FormData();
  formData.append("inputFile", new Blob([fileData], { type: data.inputFile.mimeType }), data.inputFile.name);
  formData.append("subFolder", data.subFolder);
  formData.append("description", data.description);

  return formData;
};

/**
 * Identity request adapter, directly returning the input data without any transformation.
 *
 * @param data input data
 */
const identity = (data: any): any => {
  return data;
}

type Registry = {
  [key in RequestMethod]?: {
    [key: string]: (data: any) => any
  }
}

const registry: Registry = {
  [RequestMethod.POST]: {
    "/files": (data: FileUploadProxyRequest): FormData => convertBase64ImageToFormData(data)
  }
}

/**
 * Selects an assigned service gateway request adapter for the current external service call, or the "identity" adapter,
 * if none is registered, then immediately runs the request body through it.
 *
 * @param request RESTRequest object containing the request parameters (method and path for adapter selection) and the request body
 */
export const adaptRequestBody = <T>(request: RESTRequest): T => {
  return (registry[request.method]?.[request.path] ?? identity)(request.requestBody);
}
