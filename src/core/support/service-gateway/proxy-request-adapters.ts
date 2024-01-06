import { RequestMethod } from "@/core/domain/requests";
import { FileUploadProxyRequest, PathInfo } from "@/core/model/files";
import { NextApiRequest } from "next";

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
    "files": (data: FileUploadProxyRequest): FormData => convertBase64ImageToFormData(data)
  }
}

/**
 * Returns an assigned service gateway request adapter for the current external service call. If none is registered,
 * returns the "identity" adapter.
 *
 * @param request NextApiRequest object to extract request information from
 */
export const getProxyRequestBodyAdapter = <R, T>(request: NextApiRequest): (data: R) => T => {

  const pathInfo = new PathInfo(request.query.path as string[]);
  const method = RequestMethod[request.method! as keyof typeof RequestMethod];

  return registry[method]?.[pathInfo.fullPath] ?? identity;
}
