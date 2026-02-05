import environmentProperties, { APIEnvironment } from "@/api-environment";
import { RoleListScreen } from "@/components/access/role/RoleListScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Role management main page.
 * Mapped to /access/roles
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Roles(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.roles"));
  }, []);

  return <RoleListScreen environment={environment} />
}
