import environmentProperties, { APIEnvironment } from "@/api-environment";
import { DirectoryComposerScreen } from "@/components/files/DirectoryComposerScreen";
import { FileUploaderScreen } from "@/components/files/FileUploaderScreen";
import { PathInfo } from "@/core/model/files";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Screen for creating new directories or upload files, based on the path.
 * Mapped to /files/create/(upload|directory)/{targetVFSPath}
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function VFSCreate(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();

  const pathInfo = new PathInfo(router.query.path as string[]);

  useEffect(() => {
    pageContext.updatePageTitle(t(`page.title.files.create-${pathInfo.operation}`));
  }, []);

  return pathInfo.operation === "upload"
    ? <FileUploaderScreen environment={environment} pathInfo={pathInfo} />
    : <DirectoryComposerScreen environment={environment} pathInfo={pathInfo} />
}
