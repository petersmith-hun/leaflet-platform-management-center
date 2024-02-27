import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { recreateRepositoryName } from "@/components/system/registry";
import { RepositoryTagListScreen } from "@/components/system/registry/RepositoryTagListScreen";
import { registryBrowserService } from "@/core/service/registry-browser-service";
import { SWRKey, swrKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

type DockerTagKey = { registryID: string, repositoryID: string }

const swrDockerTagKey = (query: any): SWRKey<DockerTagKey> => {

  return swrKey("system/monitoring/docker/tags", {
    registryID: query.registryID,
    repositoryID: recreateRepositoryName(query.repositoryID)
  } as DockerTagKey)
}

/**
 * View tags of selected Docker repository page.
 * Mapped to /system/docker/registry/:registryID/:repositoryID
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewRepositoryTags(environment: APIEnvironment) {

  const { getDockerRepositoryTags } = registryBrowserService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrDockerTagKey(router.query), key => getDockerRepositoryTags(key.parameter.registryID, key.parameter.repositoryID));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.docker.registry-browser.repository-contents"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <RepositoryTagListScreen repository={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
