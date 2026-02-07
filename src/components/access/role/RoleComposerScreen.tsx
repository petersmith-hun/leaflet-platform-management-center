import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { RoleModel, RoleRequest } from "@/core/model/role";
import { roleService } from "@/core/service/roles-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface RoleComposerScreenProps {
  environment: APIEnvironment;
  role?: RoleModel;
  mutate?: KeyedMutator<RoleModel>;
}

/**
 * Screen used by role manager's create/edit operations. For editing purpose, provide the role itself, as well as an SWR
 * mutate function to invalidate the cache for the edited role.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param role role data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const RoleComposerScreen = ({ environment, role, mutate }: RoleComposerScreenProps): ReactNode => {

  const { createRole, editRole } = roleService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<RoleRequest>({
    defaultValues: role
  });
  const router = useRouter();
  const roleID = router.query.id as string | undefined;

  return (
    <SubmitOperation domain={"role"} mutate={mutate} titleSupplier={role => role.name}
                     handleSubmit={handleSubmit}
                     serviceCall={entity => roleID
                       ? editRole(roleID, entity)
                       : createRole(entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={role?.name ?? t("page.title.role.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("name", { required: t("forms:validation.common.required") })}
                       label={t("forms:role.edit.name")} id={"role-name"}
                       errorSupplier={() => errors.name?.message} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <FullWidthDataCell>
                <Textarea registerReturn={register("description")} label={t("forms:role.edit.description")}
                          id={"role-description"} />
              </FullWidthDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.role")}>
            <PageOperationButton label={t("page-operations.role.back-to-roles")} icon={faList}
                                 link={"/access/roles"} />
            {roleID && <PageOperationButton label={t("page-operations.role.view")} icon={faEye}
                                                  link={`/access/roles/view/${roleID}`} />}
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
