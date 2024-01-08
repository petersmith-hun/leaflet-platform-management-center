import environmentProperties, { APIEnvironment } from "@/api-environment";
import { LogManagementScreen } from "@/components/system/logs/LogManagementScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Log management page.
 * Mapped to /system/logs
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Logs(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.logs"));
  }, []);

  return <LogManagementScreen environment={environment} />
}
