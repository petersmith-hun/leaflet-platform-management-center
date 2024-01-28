import environmentProperties, { APIEnvironment } from "@/api-environment";
import { RouteComposerScreen } from "@/components/system/routes/RouteComposerScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create frontend route page.
 * Mapped to /system/routes/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateRoute(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.route.create"));
  }, []);

  return <RouteComposerScreen environment={environment} />
}
