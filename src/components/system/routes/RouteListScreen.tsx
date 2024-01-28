import { ScreenParameters } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { RouteList } from "@/components/system/routes/RouteList";
import { FrontEndRouteDataModel, RouteType } from "@/core/model/routes";
import { routesService } from "@/core/service/routes-service";
import { swrKey } from "@/core/util/swr-key";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface RouteListFrameProps {
  routes: FrontEndRouteDataModel[];
}

const headerRoutesPredicate = (route: FrontEndRouteDataModel): boolean => route.type === RouteType.HEADER_MENU;
const footerRoutesPredicate = (route: FrontEndRouteDataModel): boolean => route.type === RouteType.FOOTER_MENU;
const otherRoutesPredicate = (route: FrontEndRouteDataModel): boolean => ![RouteType.HEADER_MENU, RouteType.FOOTER_MENU].includes(route.type);

const RouteListFrame = ({ routes }: RouteListFrameProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <RouteList routes={routes} filter={headerRoutesPredicate} title={t("page.sub-title.system.routes.header")}
                 key={"header-routes"} showOperations={true} />
      <p>&nbsp;</p>
      <RouteList routes={routes} filter={footerRoutesPredicate} title={t("page.sub-title.system.routes.footer")}
                 key={"footer-routes"} />
      <p>&nbsp;</p>
      <RouteList routes={routes} filter={otherRoutesPredicate} title={t("page.sub-title.system.routes.other")}
                 key={"other-routes"} />
    </>
  )
}

/**
 * Screen component for listing the existing frontend routes.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const RouteListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { getAllRoutes } = routesService(environment);
  const { isLoading, error, data } = useSWR(swrKey("system/routes", "all"), getAllRoutes);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <RouteListFrame routes={data!} />}
    </SWRManagedScreen>
  )
}
