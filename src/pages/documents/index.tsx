import environmentProperties, { APIEnvironment } from "@/api-environment";
import { DocumentListScreen } from "@/components/documents/DocumentListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Document manager main page.
 * Mapped to /documents
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Documents(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.documents"));
  }, []);

  return (
    <DocumentListScreen environment={environment} />
  )
}
