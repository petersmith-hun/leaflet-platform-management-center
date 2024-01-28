import environmentProperties, { APIEnvironment } from "@/api-environment";
import { RouteListScreen } from "@/components/system/routes/RouteListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Frontend routing management page.
 * Mapped to /system/routes
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Routes(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.routes"));
  }, []);

  return <RouteListScreen environment={environment} />
}
