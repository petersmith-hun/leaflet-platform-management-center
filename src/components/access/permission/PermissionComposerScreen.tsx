import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { PermissionModel, PermissionRequest } from "@/core/model/permission";
import { permissionService } from "@/core/service/permissions-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface PermissionComposerScreenProps {
  environment: APIEnvironment;
  permission?: PermissionModel;
  mutate?: KeyedMutator<PermissionModel>;
}

/**
 * Screen used by permission manager's create/edit operations. For editing purpose, provide the permission itself, as well as an SWR
 * mutate function to invalidate the cache for the edited permission.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param permission permission data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const PermissionComposerScreen = ({ environment, permission, mutate }: PermissionComposerScreenProps): ReactNode => {

  const { createPermission, editPermission } = permissionService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<PermissionRequest>({
    defaultValues: permission
  });
  const router = useRouter();
  const permissionID = router.query.id as string | undefined;

  return (
    <SubmitOperation domain={"permission"} mutate={mutate} titleSupplier={permission => permission.name}
                     handleSubmit={handleSubmit}
                     serviceCall={entity => permissionID
                       ? editPermission(permissionID, entity)
                       : createPermission(entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={permission?.name ?? t("page.title.permission.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("name", { required: t("forms:validation.common.required") })}
                       label={t("forms:permission.edit.name")} id={"permission-name"}
                       errorSupplier={() => errors.name?.message} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <FullWidthDataCell>
                <Textarea registerReturn={register("description")} label={t("forms:permission.edit.description")}
                          id={"permission-description"} />
              </FullWidthDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.permission")}>
            <PageOperationButton label={t("page-operations.permission.back-to-permissions")} icon={faList}
                                 link={"/access/permissions"} />
            {permissionID && <PageOperationButton label={t("page-operations.permission.view")} icon={faEye}
                                                  link={`/access/permissions/view/${permissionID}`} />}
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
