import environmentProperties, { APIEnvironment } from "@/api-environment";
import { PermissionComposerScreen } from "@/components/access/permission/PermissionComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create permission page.
 * Mapped to /access/permissions/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreatePermission(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.permission.create"));
  }, []);

  return <PermissionComposerScreen environment={environment} />
}
