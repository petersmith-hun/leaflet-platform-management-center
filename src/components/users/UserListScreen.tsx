import { ScreenParameters } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { UserCard } from "@/components/users/UserCard";
import { noOpPagination } from "@/core/model/common";
import { UserModel } from "@/core/model/user";
import { userService } from "@/core/service/user-service";
import { swrKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface UserListResultProps {
  users: UserModel[];
}

const UserListResult = ({ users }: UserListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={noOpPagination}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.user.name-email"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.user.role"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.user.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.user.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={users}>
        {(user: UserModel) => <UserCard key={`user-${user.id}`} user={user} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of user manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const UserListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllUsers } = userService(environment);
  const { isLoading, data, error } = useSWR(swrKey("users", "all"), getAllUsers);

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <UserListResult users={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.user")}>
          <PageOperationButton label={t("page-operations.user.new")} icon={faEdit} link="/users/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
