import environmentProperties, { APIEnvironment } from "@/api-environment";
import { DominoDeploymentsListScreen } from "@/components/system/deployments/DominoDeploymentsListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Domino deployment definition management page.
 * Mapped to /system/deployments
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Deployments(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.deployments"));
  }, []);

  return <DominoDeploymentsListScreen environment={environment} />
}
