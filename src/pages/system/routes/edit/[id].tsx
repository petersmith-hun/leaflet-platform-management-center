import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { RouteComposerScreen } from "@/components/system/routes/RouteComposerScreen";
import { routesService } from "@/core/service/routes-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Edit frontend route page.
 * Mapped to /system/routes/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditRoute(environment: APIEnvironment) {

  const { getRouteByID } = routesService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("routes/edit", router.query.id), (key) => getRouteByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.route.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <RouteComposerScreen environment={environment} route={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
