import { APIEnvironment } from "@/api-environment";
import { isDefaultAs, RoleFlag } from "@/components/access/role/commons";
import { ToastType } from "@/components/common/OperationResultToast";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { RoleModel } from "@/core/model/role";
import { roleService } from "@/core/service/roles-service";
import { PageContext } from "@/pages/_app";
import { faBuildingUser, faHouseUser } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface MarkRoleAsDefaultButtonProps {
  role: RoleModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<RoleModel>;
  flag: RoleFlag;
}

/**
 * Render a local/external default flag switch button for the given role.
 *
 * @param role data of an existing role
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 * @param flag role flag to render the button for
 */
export const MarkRoleAsDefaultButton = ({ role, environment, mutate, flag }: MarkRoleAsDefaultButtonProps): ReactNode => {

  const { markAsLocalDefault, markAsExternalDefault } = roleService(environment);
  const { t } = useTranslation();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleMarkAsDefault = (serviceCall: (id: string) => Promise<RoleModel>): void => {

    setOperationInProgress(true);
    serviceCall(role.id)
      .then(updatedEntity => {
        mutate();
        return updatedEntity;
      })
      .then(updatedEntity => showCustomToast(
        t(`toast.template.title.success.updated`, { domain: t("domain.role") }),
        t(flag === "local"
          ? "toast.role.marked-as-local-default"
          : "toast.role.marked-as-external-default", { role: role.name, }),
        updatedEntity.enabled
          ? ToastType.SUCCESS
          : ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t(`toast.template.title.failure`, { domain: t("domain.role") }),
        t(`toast.template.message.failure`, { domain: t("domain.role"), title: role.name })
      ))
      .finally(() => setOperationInProgress(false));
  }

  if (isDefaultAs(role, flag)) {
    return null;
  }

  return (
    <ConfirmedOperationButton label={t(`page-operations.role.mark-as-${flag}-default`)}
                              icon={flag === "local" ? faHouseUser : faBuildingUser}
                              popconfirmDomain={"role"} operation={`mark-as-${flag}-default`}
                              id={`${flag}-${role.id}`}
                              onSubmit={() => flag === "local"
                                ? handleMarkAsDefault(markAsLocalDefault)
                                : handleMarkAsDefault(markAsExternalDefault)}
                              awareness={AwarenessLevel.WARNING} />
  )
}