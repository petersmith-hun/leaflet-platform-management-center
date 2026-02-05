import { ScreenParameters } from "@/api-environment";
import { RoleCard } from "@/components/access/role/RoleCard";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { convertPageMeta } from "@/components/utility/page-converter";
import { SimplifiedPageModel } from "@/core/model/common";
import { RoleModel } from "@/core/model/role";
import { roleService } from "@/core/service/roles-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface RoleListResultProps {
  roles: SimplifiedPageModel<RoleModel>;
}

const RoleListResult = ({ roles }: RoleListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={convertPageMeta(roles)}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.role.name-and-description"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.role.status"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.role.dates"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.role.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={roles.content}>
        {(role: RoleModel) => <RoleCard key={`role-${role.id}`} role={role} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of role manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const RoleListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllRoles } = roleService(environment);
  const { query } = useRouter();
  const { isLoading, data, error } = useSWR(swrNumberKey("roles/page", query.page ?? 1), key => getAllRoles(key.parameter));

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <RoleListResult roles={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.role")}>
          <PageOperationButton label={t("page-operations.role.new")} icon={faEdit} link="/access/roles/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
