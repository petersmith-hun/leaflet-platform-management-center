import { ClusterMonitoringAPIEnvironment, monitoringEnvironmentProperties } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ContainerInfo } from "@/components/system/cluster/ContainerInfo";
import { clusterMonitoringService } from "@/core/service/cluster-monitoring-service";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = monitoringEnvironmentProperties;

/**
 * Docker cluster status page.
 * Mapped to /system/docker/status
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function DockerClusterStatus(environment: ClusterMonitoringAPIEnvironment) {

  const { getContainers } = clusterMonitoringService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { isLoading, data, error } = useSWR("system/monitoring/docker/containers", getContainers);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.docker.cluster-status"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ContainerInfo environment={environment} containers={data!} />}
    </SWRManagedScreen>
  )
}
