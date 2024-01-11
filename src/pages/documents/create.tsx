import environmentProperties, { APIEnvironment } from "@/api-environment";
import { DocumentComposerScreen } from "@/components/documents/DocumentComposerScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create document page.
 * Mapped to /documents/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateDocument(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.document.create"));
  }, []);

  return <DocumentComposerScreen environment={environment} />
}
