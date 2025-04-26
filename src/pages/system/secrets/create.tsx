import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SecretComposerScreen } from "@/components/system/secrets/SecretComposerScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create secret page.
 * Mapped to /system/secrets/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateSecret(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.secret.create"));
  }, []);

  return <SecretComposerScreen environment={environment} />
}
