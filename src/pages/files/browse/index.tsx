import environmentProperties, { APIEnvironment } from "@/api-environment";
import { FileBrowserScreen } from "@/components/files/FileBrowserScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * File manager main page.
 * Mapped to /files
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function FilesRoot(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.files"));
  }, []);

  // TODO change this to PathInfo
  return <FileBrowserScreen environment={environment} currentPath={""} />
}
