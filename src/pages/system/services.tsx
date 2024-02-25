import { ClusterMonitoringAPIEnvironment, monitoringEnvironmentProperties } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ServiceDashboardScreen } from "@/components/system/services/ServiceDashboardScreen";
import { clusterMonitoringService } from "@/core/service/cluster-monitoring-service";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = monitoringEnvironmentProperties;

/**
 * Service health monitoring page.
 * Mapped to /system/services
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Services(environment: ClusterMonitoringAPIEnvironment) {

  const { getServices } = clusterMonitoringService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { isLoading, data, error } = useSWR("system/monitoring/services", getServices);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.services"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ServiceDashboardScreen environment={environment} services={data!} />}
    </SWRManagedScreen>
  )
}
