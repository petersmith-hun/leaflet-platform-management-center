import environmentProperties, { APIEnvironment } from "@/api-environment";
import { UserComposerScreen } from "@/components/users/UserComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create user page.
 * Mapped to /users/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateUser(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.user.create"));
  }, []);

  return <UserComposerScreen environment={environment} />
}
