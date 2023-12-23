import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { FileMetadataEditorScreen } from "@/components/files/FileMetadataEditorScreen";
import { fileService } from "@/core/service/file-service";
import { swrKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * File metadata editor page.
 * Mapped to /files/edit/{id}
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditFileMetaData(environment: APIEnvironment) {

  const { getFileDetails } = fileService(environment);
  const router = useRouter();
  const { isLoading, data, mutate, error } = useSWR(swrKey("files/view", router.query.id), key => getFileDetails(key.parameter as string));
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.files.edit-metadata"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <FileMetadataEditorScreen pathUUID={router.query.id as string} environment={environment} file={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
