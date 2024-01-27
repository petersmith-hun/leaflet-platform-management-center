import environmentProperties, { APIEnvironment } from "@/api-environment";
import { DefaultSEOEditorScreen } from "@/components/system/seo/DefaultSEOEditorScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Default SEO configuration page.
 * Mapped to /system/seo
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function SEO(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.seo"));
  }, []);

  return <DefaultSEOEditorScreen environment={environment} />
}
