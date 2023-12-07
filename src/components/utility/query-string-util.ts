/**
 * Generates a query string based on the given string-string record.
 *
 * @param query original query object
 * @param includePage enables including the "page" parameter (for pagination purposes)
 */
export const createQueryString = (query: Record<string, string>, includePage: boolean = false): string => {

  return Object.entries(query)
    .filter(parameter => includePage || parameter[0] !== "page")
    .filter(parameter => parameter[1] !== "empty")
    .map(parameter => `${parameter[0]}=${parameter[1]}`)
    .join("&");
}
