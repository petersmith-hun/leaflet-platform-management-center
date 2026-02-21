import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Tooltip } from "@/components/common/Tooltip";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { AccountTypeFlag } from "@/components/users/AccountTypeFlag";
import { Permission } from "@/core/domain/auth";
import { AccountType, Role, UserModel } from "@/core/model/user";
import { userService } from "@/core/service/user-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { faFingerprint, faList, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewUserScreenParameters {
  user: UserModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<UserModel>;
}

const ExternalUserTooltip = ({ user }: { user: UserModel }): ReactNode => {

  return user.role === Role.EXTERNAL_USER
    ? (<Tooltip tooltipKey={"user.label.external-user-role-locked"} />)
    : null
}

/**
 * User details viewer screen component. Renders a static page with all information of the given user.
 *
 * @param user data of an existing user
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewUserScreen = ({ user, environment, mutate }: ViewUserScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { hasPermission } = useSessionHelper();
  const { enableUser, disableUser } = userService(environment);

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={user.username}>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.username")}>
              <div className="flex flex-col">
                <span>{user.username}</span>
                {user.accountType !== AccountType.LOCAL && (
                  <span className="text-xs text-gray-300"><FontAwesomeIcon icon={faFingerprint} /> {user.externalID}</span>
                )}
              </div>
            </WideDataCell>
            <NarrowDataCell title={t("forms:common.edit.language")}
                            children={t(`forms:common.edit.language.${user.locale}`)} />
            <NarrowDataCell title={t("header.user.status")}>
              <>
                <ItemEnabledStatusFlag item={user} />
                <span>&nbsp;</span>
                <AccountTypeFlag user={user} />
              </>
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.email")} children={user.email} />
            <NarrowDataCell title={t("forms:user.edit.created-at")} children={dateFormatter(user.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.last-login")}
                            children={dateFormatter(user.lastLogin) ?? t("user.label.never-logged-in")} />
            <WideDataCell title={t("forms:user.edit.last-modified-at")}
                            children={dateFormatter(user.lastModified) ?? t("user.label.never-modified")} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.role")}>
              <p>{t(`forms:user.edit.role.${user.role}`)} <ExternalUserTooltip user={user} /></p>
              <span className="block text-[0.8rem] text-gray-500 dark:text-gray-300">
                {t(`forms:user.edit.role.${user.role}.hint`)}
              </span>
            </WideDataCell>
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.user")}>
          {hasPermission(Permission.READ_USERS) && (
            <>
              {user.role !== Role.EXTERNAL_USER && (
                <PageOperationButton label={t("page-operations.user.edit.change-role")} icon={faUserGroup}
                                     link={`/users/edit/role/${user.id}`} />
              )}
              <PageOperationButton label={t("page-operations.user.back-to-users")} icon={faList} link={"/users"} />
            </>
          )}
          <GeneralStatusUpdateOperation domain={"user"} entity={user} titleSupplier={user => user.username}
                                        operation={user.enabled ? "status-disable" : "status-enable"}
                                        serviceCall={(id: number) => user.enabled
                                          ? disableUser(id)
                                          : enableUser(id)} mutate={mutate} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
