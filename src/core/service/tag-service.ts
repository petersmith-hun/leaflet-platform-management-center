import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { TagAssignmentRequest, TagModel } from "@/core/model/tag";

interface WrappedTagList {
  tags: TagModel[];
}

interface TagService {

  /**
   * TODO.
   */
  getAllTags: () => Promise<TagModel[]>;

  /**
   * TODO.
   *
   * @param attachmentRequest
   */
  attachTag: (attachmentRequest: TagAssignmentRequest) => Promise<void>;

  /**
   * TODO.
   *
   * @param attachmentRequest
   */
  detachTag: (attachmentRequest: TagAssignmentRequest) => Promise<void>;
}

/**
 * TODO.
 *
 * @param environment
 */
const tagService = (environment: APIEnvironment): TagService => {

  return {
    getAllTags(): Promise<TagModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.TAGS_ALL,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedTagList>(environment, request)
        .then(response => response?.tags ?? []);
    },

    attachTag(attachmentRequest: TagAssignmentRequest): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.TAGS_ASSIGN,
        requestBody: attachmentRequest,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    detachTag(attachmentRequest: TagAssignmentRequest): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.TAGS_ASSIGN,
        requestBody: attachmentRequest,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    }
  }
}

export default tagService;
