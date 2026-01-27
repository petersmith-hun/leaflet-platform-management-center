import environmentProperties, { APIEnvironment } from "@/api-environment";
import { OAuthApplicationListScreen } from "@/components/access/oauth/OAuthApplicationListScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * OAuth application management main page.
 * Mapped to /access/oauth-applications
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function OAuthApplications(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.oauth-applications"));
  }, []);

  return <OAuthApplicationListScreen environment={environment} />
}
