import environmentProperties, { APIEnvironment } from "@/api-environment";
import { FileBrowserScreen } from "@/components/files/FileBrowserScreen";
import { BrowserPathInfo } from "@/core/model/files";
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

  const pathInfo = new BrowserPathInfo();

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.files"));
  }, []);

  return <FileBrowserScreen environment={environment} pathInfo={pathInfo} />
}
