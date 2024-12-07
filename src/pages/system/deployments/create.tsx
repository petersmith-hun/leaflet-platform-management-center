import environmentProperties, { APIEnvironment } from "@/api-environment";
import { DeploymentComposerScreen } from "@/components/system/deployments/DeploymentComposerScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create deployment definition page.
 * Mapped to /system/deployments/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateDeployment(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.deployment.create"));
  }, []);

  return <DeploymentComposerScreen environment={environment} />
}
