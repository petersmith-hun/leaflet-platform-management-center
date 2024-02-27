import { DockerTag, RepositoryDescriptor, TagDescriptor } from "@/core/model/docker-registry";
import { dateFormatter } from "@/core/util/date-formatter";

const groupSeparator = "__";

/**
 * Creates a RepositoryDescriptor object containing collected information about the given repository for rendering.
 * Also cleans the repository name for usage in links (swaps forward slash character with double underscore).
 *
 * @param registryID Docker Registry ID
 * @param repositoryID Docker repository name
 */
export const createRepositoryDescriptor = (registryID: string, repositoryID: string): RepositoryDescriptor => {

  return {
    registryID,
    repositoryID,
    repositoryIDClean: repositoryID.replace("/", groupSeparator)
  }
}

/**
 * Translates the cleaned repository name back to its original form (swaps back double underscore with forward slash).
 *
 * @param repositoryNameInQuery cleaned repository name
 */
export const recreateRepositoryName = (repositoryNameInQuery: string): string => {
  return repositoryNameInQuery.replace(groupSeparator, "/");
}

/**
 * Creates a TagDescriptor object containing collected information about the given Docker image tag for rendering.
 *
 * @param registryID Docker Registry ID
 * @param repositoryID Docker repository name
 * @param tag image tag
 */
export const createTagDescriptor = (registryID: string, repositoryID: string, tag: DockerTag): TagDescriptor => {

  return {
    ... createRepositoryDescriptor(registryID, repositoryID),
    tag: tag.name,
    created: dateFormatter(tag.created) ?? ""
  }
}
