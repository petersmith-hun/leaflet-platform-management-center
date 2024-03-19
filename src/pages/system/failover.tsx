import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { FailoverDashboardScreen } from "@/components/system/failover/FailoverDashboardScreen";
import { failoverService } from "@/core/service/failover-service";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * CBFS failover monitoring page.
 * Mapped to /system/failover
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Failover(environment: APIEnvironment) {

  const { getFailoverStatus } = failoverService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { isLoading, data, error } = useSWR("system/monitoring/failover", getFailoverStatus);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.failover"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <FailoverDashboardScreen failover={data!} />}
    </SWRManagedScreen>
  )
}
