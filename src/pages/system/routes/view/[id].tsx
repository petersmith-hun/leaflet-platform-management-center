import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewRouteDetailsScreen } from "@/components/system/routes/ViewRouteDetailsScreen";
import { routesService } from "@/core/service/routes-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View route details page.
 * Mapped to /system/routes/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewRoute(environment: APIEnvironment) {

  const { getRouteByID } = routesService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("routes/view", router.query.id), key => getRouteByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.route.view"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewRouteDetailsScreen route={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
