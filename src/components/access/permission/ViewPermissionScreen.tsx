import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { PermissionModel } from "@/core/model/permission";
import { permissionService } from "@/core/service/permissions-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewPermissionScreenParameters {
  permission: PermissionModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<PermissionModel>;
}

/**
 * Permission viewer screen component. Renders a static page with all information of the given permission.
 *
 * @param permission data of an existing permission
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewPermissionScreen = ({ permission, environment, mutate }: ViewPermissionScreenParameters): ReactNode => {

  const { enablePermission, disablePermission, deletePermissionByID } = permissionService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={permission.name}>
          <DataRow>
            <WideDataCell title={t("forms:permission.edit.name")} children={permission.name} />
            <NarrowDataCell title={t("forms:permission.edit.general-status")}>
              <ItemEnabledStatusFlag item={permission} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:permission.edit.description")} children={permission.description} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:permission.edit.created-at")}
                          children={dateFormatter(permission.created)} />
            <NarrowDataCell title={t("forms:permission.edit.last-modified-at")}
                            children={dateFormatter(permission.lastModified) ?? t("permission.label.never-modified")} />
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.permission")}>
          <PageOperationButton label={t("page-operations.permission.edit")} icon={faPencil}
                               link={`/access/permissions/edit/${permission.id}`} />
          <PageOperationButton label={t("page-operations.permission.back-to-permissions")} icon={faList}
                               link={"/access/permissions"} />
          <GeneralStatusUpdateOperation domain={"permission"} entity={permission} titleSupplier={permission => permission.name}
                                        operation={permission.enabled ? "status-disable" : "status-enable"}
                                        serviceCall={(id: string) => permission.enabled
                                          ? disablePermission(id)
                                          : enablePermission(id)} mutate={mutate} />
          <DeleteOperation domain={"permission"} entity={permission} titleSupplier={permission => permission.name}
                           serviceCall={deletePermissionByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
