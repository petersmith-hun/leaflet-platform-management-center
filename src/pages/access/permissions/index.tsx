import environmentProperties, { APIEnvironment } from "@/api-environment";
import { PermissionListScreen } from "@/components/access/permission/PermissionListScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Permission management main page.
 * Mapped to /access/permissions
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Permissions(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.permissions"));
  }, []);

  return <PermissionListScreen environment={environment} />
}
