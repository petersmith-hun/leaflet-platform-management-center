import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { AwarenessLevel, PageOperationButton } from "@/components/navigation/OperationButton";
import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { FileDataModel, PathInfo } from "@/core/model/files";
import { fileService } from "@/core/service/file-service";
import { faCheck, faCopy, faFolderOpen, faList, faPencil, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface FileViewerProps {
  environment: APIEnvironment;
  file: FileDataModel;
  pathInfo: PathInfo;
}

interface CopyReferenceButtonProperties {
  label: string;
  icon: IconDefinition;
  onClick: () => void;
  id: string;
  awareness?: AwarenessLevel;
}

const CopyReferenceButton = ({ label, icon, onClick, awareness = AwarenessLevel.NORMAL }: CopyReferenceButtonProperties): ReactNode => {

  return (
    <div className="mb-3">
      <button type="button"
              className={`${awareness} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={onClick}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
      </button>
    </div>
  )
}

const copyReference = (reference: string, setCopied?: Dispatch<SetStateAction<boolean>>): void => {

  const formattedReference = `![alt]({resource-server-url}${reference})`;
  navigator.clipboard.writeText(formattedReference);
  setCopied && setCopied(true);
}

/**
 * File details viewer screen.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param file file data
 * @param pathInfo current VFS path data
 */
export const FileViewerScreen = ({ environment, file, pathInfo }: FileViewerProps): ReactNode => {

  const { deleteFileByPathUUID } = fileService(environment);
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Clipboard]));
  }, []);

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={file.originalFilename}>
          <DataRow>
            <FullWidthDataCell>
              <img
                src={`${environment.resourceServer}/${file.reference}`}
                className="m-auto h-auto max-w-5xl shadow-lg dark:shadow-black/30"
                alt={file.description} />
            </FullWidthDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:file.edit.original-filename")} children={file.originalFilename} />
            <WideDataCell title={t("forms:file.edit.reference")} children={file.reference} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:file.edit.mime")} children={file.acceptedAs} />
            <WideDataCell title={t("forms:file.edit.physical-relative-path")} children={file.path} />
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:file.edit.description")}>
              <p className="blockquote text-neutral-300">{file.description}</p>
            </FullWidthDataCell>
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.file")}>
          <PageOperationButton label={t("page-operations.file.edit-metadata")} icon={faPencil}
                               link={`/files/edit/${file.pathUUID}`} />
          <PageOperationButton label={t("page-operations.file.back-to-vfs-root")} icon={faList}
                               link={"/files/browse"} />
          <PageOperationButton label={t("page-operations.file.show-current-folder")} icon={faFolderOpen}
                               link={`/files/browse/${pathInfo.fullPath}`} />
          {!copied && <CopyReferenceButton awareness={AwarenessLevel.POSITIVE} id={"file-copy-reference"}
                                           label={t("page-operations.file.copy-reference")} icon={faCopy}
                                           onClick={() => copyReference(file.reference, setCopied)} />}
          {copied && <CopyReferenceButton awareness={AwarenessLevel.POSITIVE} id={"file-copy-reference"}
                                          label={t("page-operations.file.copied")} icon={faCheck}
                                          onClick={() => copyReference(file.reference)} />}
          <DeleteOperation domain={"file"} entity={file} titleSupplier={file => file.originalFilename}
                           serviceCall={deleteFileByPathUUID} idProvider={file => file.pathUUID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
