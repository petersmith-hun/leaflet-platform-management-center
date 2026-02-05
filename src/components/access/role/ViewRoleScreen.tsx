import { APIEnvironment } from "@/api-environment";
import { MarkedAsDefaultFlag } from "@/components/access/role/commons";
import { MarkRoleAsDefaultButton } from "@/components/access/role/MarkRoleAsDefaultButton";
import {
  PermissionAssignmentModal,
  ShowPermissionAssignmentModalButton
} from "@/components/access/role/PermissionAssignmentModal";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { RoleModel } from "@/core/model/role";
import { roleService } from "@/core/service/roles-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewRoleScreenParameters {
  role: RoleModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<RoleModel>;
}

/**
 * Role viewer screen component. Renders a static page with all information of the given role.
 *
 * @param role data of an existing role
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewRoleScreen = ({ role, environment, mutate }: ViewRoleScreenParameters): ReactNode => {

  const { enableRole, disableRole, deleteRoleByID } = roleService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={role.name}>
          <DataRow>
            <WideDataCell title={t("forms:role.edit.name")} children={role.name} />
            <NarrowDataCell title={t("forms:role.edit.general-status")}>
              <ItemEnabledStatusFlag item={role} />
              <MarkedAsDefaultFlag flag={"local"} role={role} />
              <MarkedAsDefaultFlag flag={"external"} role={role} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:role.edit.description")} children={role.description} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:role.edit.created-at")}
                          children={dateFormatter(role.created)} />
            <NarrowDataCell title={t("forms:role.edit.last-modified-at")}
                            children={dateFormatter(role.lastModified) ?? t("role.label.never-modified")} />
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.role")}>
          <PageOperationButton label={t("page-operations.role.edit")} icon={faPencil}
                               link={`/access/roles/edit/${role.id}`} />
          <PageOperationButton label={t("page-operations.role.back-to-roles")} icon={faList}
                               link={"/access/roles"} />
          <ShowPermissionAssignmentModalButton />
          <MarkRoleAsDefaultButton flag={"local"} role={role} environment={environment} mutate={mutate} />
          <MarkRoleAsDefaultButton flag={"external"} role={role} environment={environment} mutate={mutate} />
          <GeneralStatusUpdateOperation domain={"role"} entity={role} titleSupplier={role => role.name}
                                        operation={role.enabled ? "status-disable" : "status-enable"}
                                        serviceCall={(id: string) => role.enabled
                                          ? disableRole(id)
                                          : enableRole(id)} mutate={mutate} />
          <DeleteOperation domain={"role"} entity={role} titleSupplier={role => role.name}
                           serviceCall={deleteRoleByID} />
        </PageOperationCard>
      </NarrowPane>
      <PermissionAssignmentModal role={role} environment={environment} mutate={mutate} />
    </MultiPaneScreen>
  )
}
