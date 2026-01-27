import { ScreenParameters } from "@/api-environment";
import { PermissionCard } from "@/components/access/permission/PermissionCard";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { convertPageMeta } from "@/components/utility/page-converter";
import { SimplifiedPageModel } from "@/core/model/common";
import { PermissionModel } from "@/core/model/permission";
import { permissionService } from "@/core/service/permissions-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface PermissionListResultProps {
  permissions: SimplifiedPageModel<PermissionModel>;
}

const PermissionListResult = ({ permissions }: PermissionListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={convertPageMeta(permissions)}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.permission.name-and-description"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.permission.status"} widthClass={"w-1/12"} />
        <ItemListHeaderItem titleKey={"header.permission.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.permission.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={permissions.content}>
        {(permission: PermissionModel) => <PermissionCard key={`permission-${permission.id}`} permission={permission} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of permission manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const PermissionListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllPermissions } = permissionService(environment);
  const { query } = useRouter();
  const { isLoading, data, error } = useSWR(swrNumberKey("permissions/page", query.page ?? 1), key => getAllPermissions(key.parameter));

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <PermissionListResult permissions={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.permission")}>
          <PageOperationButton label={t("page-operations.permission.new")} icon={faEdit} link="/access/permissions/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
