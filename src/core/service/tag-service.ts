import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { TagAssignmentRequest, TagEditRequest, TagModel } from "@/core/model/tag";

interface WrappedTagList {
  tags: TagModel[];
}

interface TagService {

  /**
   * Retrieves all existing tag.
   */
  getAllTags: () => Promise<TagModel[]>;

  /**
   * Retrieves a single tag by its ID.
   *
   * @param id tag ID
   */
  getTagByID: (id: number) => Promise<TagModel>;

  /**
   * Created a new tag.
   *
   * @param tag tag data to be submitted
   */
  createTag: (tag: TagEditRequest) => Promise<TagModel>;

  /**
   * Modifies an existing tag.
   *
   * @param id ID of tag to be updated
   * @param tag tag data to be submitted
   */
  editTag: (id: number, tag: TagEditRequest) => Promise<TagModel>;

  /**
   * Flips the general status (enabled/disabled) of the given tag.
   *
   * @param id ID of tag to be updated
   */
  changeGeneralStatus: (id: number) => Promise<void>;

  /**
   * Removes an existing tag.
   *
   * @param id ID of tag to be deleted
   */
  deleteTagByID: (id: number) => Promise<void>;

  /**
   * Attaches the given tag to the article.
   *
   * @param attachmentRequest tag-article attachment request
   */
  attachTag: (attachmentRequest: TagAssignmentRequest) => Promise<void>;

  /**
   * Detaches the given tag from the article.
   *
   * @param attachmentRequest tag-article detachment request
   */
  detachTag: (attachmentRequest: TagAssignmentRequest) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling tag management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
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

    getTagByID(id: number): Promise<TagModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.TAGS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    createTag(tag: TagEditRequest): Promise<TagModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.TAGS_ALL,
        requestBody: tag,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    editTag(id: number, tag: TagEditRequest): Promise<TagModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.TAGS_BY_ID,
        pathParameters: { id },
        requestBody: tag,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    changeGeneralStatus(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.TAGS_GENERAL_STATUS,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    deleteTagByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.TAGS_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
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
