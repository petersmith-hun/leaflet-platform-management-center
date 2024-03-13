import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { DirectoryCreationRequestModel, PathInfo } from "@/core/model/files";
import { fileService } from "@/core/service/file-service";
import { faFolderOpen, faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DirectoryComposerProps {
  environment: APIEnvironment;
  pathInfo: PathInfo;
}

/**
 * Screen to create a new folder in the VFS.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param pathInfo current VFS path data
 */
export const DirectoryComposerScreen = ({ environment, pathInfo }: DirectoryComposerProps): ReactNode => {

  const { createDirectory } = fileService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<DirectoryCreationRequestModel>()

  return (
    <SubmitOperation domain={"directory"}
                     redirectOverride={(entity) => `/files/browse/${pathInfo.fullPath}/${entity.name}`}
                     titleSupplier={entity => entity.name}
                     serviceCall={entity => createDirectory(entity)}
                     handleSubmit={handleSubmit}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={t("page.title.files.create-folder-here", {
            current: pathInfo.fullPath,
            interpolation: { escapeValue: false }
          })}>
            <DataRow>
              <WideDataCell>
                <input type="hidden" {...register("parent")} value={pathInfo.fullPath} />
                <Input registerReturn={register("name", { required: t("forms:validation.common.required") })}
                       label={t("forms:directory.edit.name")} id={"directory-name"}
                       errorSupplier={() => errors.name?.message} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.directory")}>
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
