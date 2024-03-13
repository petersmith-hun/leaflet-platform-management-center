import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { FileDataModel, FileMetadataUpdateRequestModel } from "@/core/model/files";
import { fileService } from "@/core/service/file-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface FileMetadataEditorProps {

  environment: APIEnvironment;
  pathUUID: string;
  file: FileDataModel;
  mutate: KeyedMutator<FileDataModel>;
}

/**
 * Screen to edit the metadata of an existing file.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param pathUUID UUID of the file to be edited
 * @param file object containing the existing metadata
 * @param mutate SWR mutate function for data invalidation
 */
export const FileMetadataEditorScreen = ({ environment, pathUUID, file, mutate }: FileMetadataEditorProps): ReactNode => {

  const { updateFileMetadata } = fileService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FileMetadataUpdateRequestModel>({
    defaultValues: {
      originalFilename: file.originalFilename,
      description: file.description
    }
  });

  return (
    <SubmitOperation domain={"fileView"} handleSubmit={handleSubmit} mutate={mutate}
                     titleSupplier={file => file.originalFilename}
                     serviceCall={entity => updateFileMetadata(pathUUID, entity)}
                     idProvider={_ => pathUUID}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={file.originalFilename}>
            <DataRow>
              <WideDataCell>
                <Input
                  registerReturn={register("originalFilename", { required: t("forms:validation.common.required") })}
                  label={t("forms:file.edit.original-filename")} id={"file-name"}
                  errorSupplier={() => errors.originalFilename?.message} />
              </WideDataCell>
              <WideDataCell>
                <Textarea registerReturn={register("description", { required: t("forms:validation.common.required") })}
                          label={t("forms:file.edit.description")} id={"file-description"}
                          errorSupplier={() => errors.description?.message} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.category")}>
            <PageOperationButton label={t("page-operations.file.back-to-vfs-root")} icon={faList}
                                 link={"/files/browse"} />
            <PageOperationButton label={t("page-operations.file.view")} icon={faEye}
                                 link={`/files/view/${pathUUID}`} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
