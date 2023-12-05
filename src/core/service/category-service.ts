import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { CategoryModel } from "@/core/model/category";

interface WrappedCategoryList {
  categories: CategoryModel[];
}

interface CategoryService {

  /**
   * Retrieves all existing category.
   */
  getAllCategories: () => Promise<CategoryModel[]>;
}

/**
 * Service implementation for Leaflet API communication, handling category management requests.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
const categoryService = (environment: APIEnvironment): CategoryService => {

  return {

    getAllCategories(): Promise<CategoryModel[]> {

      const request = new RESTRequest({
        method: RequestMethod.GET,
        path: LeafletPath.CATEGORY_ALL,
        authorization: environment.authorization!
      });

      return leafletClient<WrappedCategoryList>(environment, request)
        .then(response => response?.categories ?? []);
    }
  }
}

export default categoryService;
