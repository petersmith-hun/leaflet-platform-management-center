import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { DeploymentComposerScreen } from "@/components/system/deployments/DeploymentComposerScreen";
import { dominoService } from "@/core/service/domino-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Create deployment definition page.
 * Mapped to /system/deployments/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateDeployment(environment: APIEnvironment) {

  const { getDeployment } = dominoService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrStringKey("deployments/edit", router.query.id), (key) => getDeployment(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.deployment.edit", { id: router.query.id }));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <DeploymentComposerScreen environment={environment} deployment={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
