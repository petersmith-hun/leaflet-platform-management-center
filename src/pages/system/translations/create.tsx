import environmentProperties, { APIEnvironment } from "@/api-environment";
import { TranslationPackComposerScreen } from "@/components/system/translations/TranslationPackComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create new translation pack page.
 * Mapped to /system/translations/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreatePack(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.translation.create"));
  }, []);

  return <TranslationPackComposerScreen environment={environment} />
}
