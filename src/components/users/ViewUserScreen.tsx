import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { Permission } from "@/core/domain/auth";
import { Role, UserModel } from "@/core/model/user";
import { dateFormatter } from "@/core/util/date-formatter";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { faCircleInfo, faList, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ViewUserScreenParameters {
  user: UserModel;
}

const ExternalUserTooltip = ({ user }: { user: UserModel }): ReactNode => {

  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip }, { allowReinits: true });
    };
    init();
  }, []);

  if (user.role !== Role.EXTERNAL_USER) {
    return null;
  }

  return (
    <span
      className="transititext-primary text-neutral transition duration-150 ease-in-out hover:text-neutral-600 focus:text-neutral-600 active:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:active:text-neutral-600"
      data-te-toggle="tooltip"
      title={t("user.label.external-user-role-locked")}>
      <FontAwesomeIcon icon={faCircleInfo} />
    </span>
  )
}

/**
 * User details viewer screen component. Renders a static page with all information of the given user.
 *
 * @param user data of an existing user
 */
export const ViewUserScreen = ({ user }: ViewUserScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { hasPermission } = useSessionHelper();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={user.username}>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.username")} children={user.username} />
            <NarrowDataCell title={t("forms:common.edit.language")}
                            children={t(`forms:common.edit.language.${user.locale}`)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.email")} children={user.email} />
            <NarrowDataCell title={t("forms:user.edit.created-at")} children={dateFormatter(user.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:user.edit.role")}>
              <p>{t(`forms:user.edit.role.${user.role}`)} <ExternalUserTooltip user={user} /></p>
              <span className="block text-[0.8rem] text-gray-500 dark:text-gray-300">
                {t(`forms:user.edit.role.${user.role}.hint`)}
              </span>
            </WideDataCell>
            <NarrowDataCell title={t("forms:user.edit.last-modified-at")}
                            children={dateFormatter(user.lastModified) ?? t("user.label.never-modified")} />
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
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
