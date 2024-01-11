import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { DocumentComposerScreen } from "@/components/documents/DocumentComposerScreen";
import documentService from "@/core/service/document-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Edit document page.
 * Mapped to /documents/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditDocument(environment: APIEnvironment) {

  const { getDocumentByID } = documentService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("documents/edit", router.query.id), (key) => getDocumentByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.document.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <DocumentComposerScreen environment={environment} document={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
