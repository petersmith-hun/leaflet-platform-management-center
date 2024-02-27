/**
 * Domain class representing a Docker containing the list of repositories in a registry.
 */
export interface DockerRegistryContent {

  registryName: string;
  repositories: string[];
}

/**
 * Domain class representing a Docker image tag.
 */
export interface DockerTag {

  name: string;
  created: string;
}

/**
 * Domain class representing a Docker repository base information object.
 */
export interface DockerRepository {

  registry: string;
  name: string;
  tags: DockerTag[];
}

/**
 * Domain class to wrap repository information for showing it on the UI.
 */
export interface RepositoryDescriptor {

  registryID: string;
  repositoryID: string;
  repositoryIDClean: string;
}

/**
 * Domain class to wrap image tag information for showing it on the UI.
 */
export interface TagDescriptor extends RepositoryDescriptor {

  tag: string;
  created: string;
}
