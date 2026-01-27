import environmentProperties, { APIEnvironment } from "@/api-environment";
import { OAuthApplicationComposerScreen } from "@/components/access/oauth/OAuthApplicationComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create OAuth application page.
 * Mapped to /access/oauth-applications/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateOAuthApplication(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.oauth-application.create"));
  }, []);

  return <OAuthApplicationComposerScreen environment={environment} />
}
