import { APIEnvironment } from "@/api-environment";
import leafletClient, { LeafletPath } from "@/core/client/leaflet-client";
import { RequestMethod, RESTRequest } from "@/core/domain/requests";
import { CategoryModel } from "@/core/model/category";

interface WrappedCategoryList {
  categories: CategoryModel[];
}

interface CategoryService {

  /**
   * TODO.
   */
  getAllCategories: () => Promise<CategoryModel[]>;
}

/**
 * TODO.
 *
 * @param environment
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
