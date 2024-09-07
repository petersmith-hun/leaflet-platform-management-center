import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewDeploymentScreen } from "@/components/system/deployments/ViewDeploymentScreen";
import { dominoService } from "@/core/service/domino-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View Domino deployment definition details page.
 * Mapped to /system/deployments/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewDeployment(environment: APIEnvironment) {

  const { getDeployment } = dominoService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrStringKey("deployments/view", router.query.id), key => getDeployment(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.deployment.view"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewDeploymentScreen deployment={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
