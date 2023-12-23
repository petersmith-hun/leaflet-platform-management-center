import environmentProperties, { APIEnvironment } from "@/api-environment";
import { FileBrowserScreen } from "@/components/files/FileBrowserScreen";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * File manager main page.
 * Mapped to /files
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Files(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.files"));
  }, []);

  // TODO change this to PathInfo
  return <FileBrowserScreen environment={environment} currentPath={(router.query.path as string[]).join("/")} />
}
