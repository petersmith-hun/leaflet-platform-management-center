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

/**
 * Response model representing the data of a folder.
 */
export interface FolderDataModel {

  folderName: string;
  absolutePath: string;
}

/**
 * Response model for the VFS (Virtual File System) browser.
 */
export interface VFSBrowserModel {

  parent: string;
  currentPath: string;
  directories: FolderDataModel[];
  files: FileDataModel[];
}

/**
 * Model representing a file metadata update request.
 */
export interface FileMetadataUpdateRequestModel {

  originalFilename: string;
  description: string;
}

/**
 * Model representing a folder creation request.
 */
export interface DirectoryCreationRequestModel {

  parent: string;
  name: string;
}

/**
 * Form data representation of the file upload form.
 */
export interface FileUploadRequest {

  inputFile: FileList;
  subFolder: string;
  description: string;
}

/**
 * Request model sent to the service gateway API for file uploads.
 * Will be converted to the internally used representation in service communication.
 */
export interface FileUploadProxyRequest {

  inputFile: {
    mimeType: string,
    name: string,
    size: number,
    content: string
  };
  subFolder: string;
  description: string;
}

/**
 * Path details for the current VFS path.
 */
export class PathInfo {

  readonly operation: "browse" | "view" | "upload" | "directory";
  readonly fullPath: string;
  readonly pathWithoutRoot: string;

  constructor(pathSegments: string[]) {
    this.operation = pathSegments[0] as typeof this.operation;
    this.fullPath = pathSegments.slice(1).join("/");
    this.pathWithoutRoot = pathSegments.length > 2
      ? pathSegments.slice(2).join("/")
      : "";
  }
}

/**
 * Specific PathInfo object for file viewer.
 */
export class ViewFilePathInfo extends PathInfo {

  constructor(fileDataModel: FileDataModel) {
    super(["view", ...fileDataModel.path.split("/").slice(0, -1)]);
  }
}

/**
 * Specific PathInfo object for VFS browser.
 */
export class BrowserPathInfo extends PathInfo {

  constructor(pathSegments: string[] = []) {
    super(["browse", ...pathSegments]);
  }
}
