import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { CategoryEditRequest, CategoryModel } from "@/core/model/category";

interface WrappedCategoryList {
  categories: CategoryModel[];
}

interface CategoryService {

  /**
   * Retrieves all existing category.
   */
  getAllCategories: () => Promise<CategoryModel[]>;

  /**
   * Retrieves a single category by its ID.
   *
   * @param id category ID
   */
  getCategoryByID: (id: number) => Promise<CategoryModel>;

  /**
   * Created a new category.
   *
   * @param category category data to be submitted
   */
  createCategory: (category: CategoryEditRequest) => Promise<CategoryModel>;

  /**
   * Modifies an existing category.
   *
   * @param id ID of category to be updated
   * @param category category data to be submitted
   */
  editCategory: (id: number, category: CategoryEditRequest) => Promise<CategoryModel>;


  /**
   * Flips the general status (enabled/disabled) of the given category.
   *
   * @param id ID of category to be updated
   */
  changeGeneralStatus: (id: number) => Promise<CategoryModel>;

  /**
   * Removes an existing category.
   *
   * @param id ID of category to be deleted
   */
  deleteCategoryByID: (id: number) => Promise<void>;
}

/**
 * Service implementation for Leaflet API communication, handling category management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
const categoryService = (environment: APIEnvironment): CategoryService => {

  return {

    async getAllCategories(): Promise<CategoryModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.CATEGORY_ALL,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedCategoryList>(environment, request)
        .then(response => response?.categories ?? []);
    },

    async getCategoryByID(id: number): Promise<CategoryModel> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.CATEGORY_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async createCategory(category: CategoryEditRequest): Promise<CategoryModel> {

      const request = new RESTRequest({
        method: RequestMethod.POST,
        path: LeafletPath.CATEGORY_ALL,
        requestBody: category,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async editCategory(id: number, category: CategoryEditRequest): Promise<CategoryModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.CATEGORY_BY_ID,
        pathParameters: { id },
        requestBody: category,
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async changeGeneralStatus(id: number): Promise<CategoryModel> {

      const request = new RESTRequest({
        method: RequestMethod.PUT,
        path: LeafletPath.CATEGORY_GENERAL_STATUS,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },

    async deleteCategoryByID(id: number): Promise<void> {

      const request = new RESTRequest({
        method: RequestMethod.DELETE,
        path: LeafletPath.CATEGORY_BY_ID,
        pathParameters: { id },
        authorization: environment.authorization!
      });

      return leafletClient(environment, request);
    },
  }
}

export default categoryService;
