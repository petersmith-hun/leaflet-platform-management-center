/**
 * Response model representing an uploaded file.
 */
export interface FileDataModel {

  originalFilename: string;
  reference: string;
  acceptedAs: string;
  description: string;
  path: string;
  pathUUID: string;
}
