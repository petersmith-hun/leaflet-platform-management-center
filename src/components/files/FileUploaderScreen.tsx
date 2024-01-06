import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { FileInput } from "@/components/form/FileInput";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { FileUploadRequest, PathInfo } from "@/core/model/files";
import { fileService } from "@/core/service/file-service";
import { faFolderOpen, faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FileUploaderProps {
  environment: APIEnvironment;
  pathInfo: PathInfo;
}

/**
 * Screen to upload a new file into the VFS.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param currentPath current VFS path data
 */
export const FileUploaderScreen = ({ environment, pathInfo }: FileUploaderProps): ReactNode => {

  const { uploadFile } = fileService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FileUploadRequest>();

  useEffect(() => {
    const init = async () => {
      const { Input, initTE } = await import("tw-elements");
      initTE({ Input }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <SubmitOperation domain={"fileView"} handleSubmit={handleSubmit}
                     titleSupplier={file => file.inputFile[0].name}
                     serviceCall={entity => uploadFile(entity)}
                     idProvider={file => file.pathUUID}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={t("page.title.files.create-upload-here", {
            current: pathInfo.fullPath,
            interpolation: { escapeValue: false }
          })}>
            <DataRow>
              <WideDataCell>
                <input type="hidden" {...register("subFolder")} value={pathInfo.pathWithoutRoot} />
                <FileInput registerReturn={register("inputFile", { required: t("forms:validation.common.required") })}
                           errorSupplier={() => errors.inputFile?.message} />
              </WideDataCell>
              <WideDataCell>
                <Textarea registerReturn={register("description")}
                          label={t("forms:file.edit.description")} id={"file-description"} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.file")}>
            <PageOperationButton label={t("page-operations.file.back-to-vfs-root")} icon={faList}
                                 link={"/files/browse"} />
            <PageOperationButton label={t("page-operations.file.show-current-folder")} icon={faFolderOpen}
                                 link={`/files/browse/${pathInfo.fullPath}`} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
