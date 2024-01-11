import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewDocumentScreen } from "@/components/documents/ViewDocumentScreen";
import documentService from "@/core/service/document-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View document page.
 * Mapped to /documents/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewDocument(environment: APIEnvironment) {

  const { getDocumentByID } = documentService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("document/view", router.query.id), key => getDocumentByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.document.view"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewDocumentScreen document={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
