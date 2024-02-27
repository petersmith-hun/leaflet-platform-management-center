import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { RepositoryListScreen } from "@/components/system/registry/RepositoryListScreen";
import { registryBrowserService } from "@/core/service/registry-browser-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View repositories of selected Docker registry page.
 * Mapped to /system/docker/registry/:registryID
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewRepositories(environment: APIEnvironment) {

  const { getDockerRepositories } = registryBrowserService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
  } = useSWR(swrStringKey("system/monitoring/docker/repositories", router.query.registryID), key => getDockerRepositories(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.docker.registry-browser.registry-contents"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <RepositoryListScreen registry={data!} />}
    </SWRManagedScreen>
  )
}
