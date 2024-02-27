import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { RegistryListScreen } from "@/components/system/registry/RegistryListScreen";
import { registryBrowserService } from "@/core/service/registry-browser-service";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Docker Registry browser page.
 * Mapped to /system/docker/registry
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function DockerRegistryBrowser(environment: APIEnvironment) {

  const { getConfiguredRegistries } = registryBrowserService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { isLoading, data, error } = useSWR("system/monitoring/docker/registries", getConfiguredRegistries);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.docker.registry-browser"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <RegistryListScreen registries={data!} />}
    </SWRManagedScreen>
  )
}
