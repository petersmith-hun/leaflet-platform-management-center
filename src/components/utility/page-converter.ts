import { Pagination, SimplifiedPageModel } from "@/core/model/common";

/**
 * Converts simplified pagination metainfo represented by SimplifiedPageModel to the commonly used Pagination object.
 *
 * @param simplifiedPage original simplified page to be converted
 */
export const convertPageMeta = (simplifiedPage: SimplifiedPageModel<unknown>): Pagination => {

  const pageInfo = simplifiedPage.page;
  const correctPageNumber = pageInfo.number + 1;

  return {
    pageNumber: correctPageNumber,
    pageCount: pageInfo.totalPages,
    entityCount: pageInfo.totalElements,
    entityCountOnPage: pageInfo.size,
    first: correctPageNumber === 1,
    last: pageInfo.number === pageInfo.totalPages,
    hasNext: correctPageNumber !== pageInfo.totalPages && correctPageNumber < pageInfo.totalPages,
    hasPrevious: correctPageNumber > 1 && correctPageNumber <= pageInfo.totalPages + 1,
  }
}
