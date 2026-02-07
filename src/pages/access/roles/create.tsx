import environmentProperties, { APIEnvironment } from "@/api-environment";
import { RoleComposerScreen } from "@/components/access/role/RoleComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create role page.
 * Mapped to /access/roles/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateRole(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.role.create"));
  }, []);

  return <RoleComposerScreen environment={environment} />
}
