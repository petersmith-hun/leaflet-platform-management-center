import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SecretListScreen } from "@/components/system/secrets/SecretsListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Domino Secret Manager main page.
 * Mapped to /system/secrets
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Secrets(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.secret"));
  }, []);

  return <SecretListScreen environment={environment} />
}
