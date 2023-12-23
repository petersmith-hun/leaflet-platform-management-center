import { APIEnvironment, ScreenParameters } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell } from "@/components/common/DataRow";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { AwarenessLevel, PageOperationButton } from "@/components/navigation/OperationButton";
import { FileDataModel, FolderDataModel, VFSBrowserModel } from "@/core/model/files";
import { fileService } from "@/core/service/file-service";
import { swrKey } from "@/core/util/swr-key";
import { faFolderOpen, faFolderPlus, faLevelUp, faList, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface FileBrowserContentProps extends ScreenParameters {
  vfs: VFSBrowserModel;
}

interface FileBrowserProps extends ScreenParameters {
  currentPath: string;
}

const folderUpPath = "..";
const rootPath = "/";

const Folder = ({ folder }: { folder: FolderDataModel }): ReactNode => {

  return (
    <DataRow additionalClasses="hover:text-gray-400">
      <FullWidthDataCell title="">
        <Link href={`/files/browse${folder.absolutePath}`} className="w-full inline-block">
          <FontAwesomeIcon className="w-6 h-6 mr-3" icon={folder.folderName === folderUpPath ? faLevelUp : faFolderOpen} />
          <span>{folder.folderName}</span>
        </Link>
      </FullWidthDataCell>
    </DataRow>
  )
}

const File = ({ file, environment }: { environment: APIEnvironment, file: FileDataModel }): ReactNode => {

  return (
    <DataRow additionalClasses="hover:text-gray-400">
      <FullWidthDataCell title="">
        <Link href={`/files/view/${file.pathUUID}`} className="w-full inline-block">
          <img
            src={`${environment.resourceServer}/${file.reference}`}
            className="inline-block mr-3 max-w-[100px] rounded border bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
            alt={file.originalFilename} />
          <span>{file.originalFilename}</span>
        </Link>
      </FullWidthDataCell>
    </DataRow>
  )
}

const FileBrowserContent = ({ environment, vfs }: FileBrowserContentProps): ReactNode => {

  return (
    <WidePane>
      <CardWithTitle title={vfs.currentPath}>
        {vfs.currentPath !== vfs.parent &&
					<Folder key="folder-parent" folder={{ folderName: folderUpPath, absolutePath: vfs.parent }} />
        }
        {vfs.directories.map(folder =>
          <Folder key={`folder-${folder.folderName}`} folder={folder} />
        )}
        {vfs.files.map(file =>
          <File environment={environment} key={`file-${file.pathUUID}`} file={file} />
        )}
      </CardWithTitle>
    </WidePane>
  )
}

/**
 * Main screen of the VFS browser.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param currentPath current VFS path
 */
export const FileBrowserScreen = ({ environment, currentPath }: FileBrowserProps): ReactNode => {

  const { t } = useTranslation();
  const { browse } = fileService(environment);
  const {
    isLoading,
    data,
    error
  } = useSWR(swrKey("files/browse", currentPath), (key) => browse(key.parameter as string));

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <FileBrowserContent environment={environment} vfs={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.file")}>
          <PageOperationButton label={t("page-operations.file.back-to-vfs-root")} icon={faList} link="/files/browse" />
          {data?.currentPath !== rootPath &&
            <>
							<PageOperationButton label={t("page-operations.file.upload-here")} icon={faUpload}
																	 link={`/files/create/upload/${currentPath}`} awareness={AwarenessLevel.POSITIVE} />
							<PageOperationButton label={t("page-operations.file.new-folder-here")} icon={faFolderPlus}
																	 link={`/files/create/directory/${currentPath}`} awareness={AwarenessLevel.POSITIVE} />
            </>
          }
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
