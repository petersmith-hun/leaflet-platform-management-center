import environmentProperties, { APIEnvironment } from "@/api-environment";
import { TranslationPackListScreen } from "@/components/system/translations/TranslationPackListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Translation management page.
 * Mapped to /system/translations
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Translations(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.translations"));
  }, []);

  return <TranslationPackListScreen environment={environment} />
}
