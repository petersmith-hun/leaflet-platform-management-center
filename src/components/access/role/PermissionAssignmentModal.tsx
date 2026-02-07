import { APIEnvironment } from "@/api-environment";
import { ItemListCard } from "@/components/common/Cards";
import { InlineLoadingIndicator, SimpleLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { ItemListHeader } from "@/components/common/ItemListPane";
import { Modal } from "@/components/common/Modal";
import { Separator } from "@/components/common/Separator";
import { UnboundSwitch } from "@/components/form/Switch";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { SimplifiedPageModel } from "@/core/model/common";
import { PermissionModel } from "@/core/model/permission";
import { RoleModel } from "@/core/model/role";
import { permissionService } from "@/core/service/permissions-service";
import { roleService } from "@/core/service/roles-service";
import { PageContext } from "@/pages/_app";
import { faCheck, faShieldHalved, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR, { KeyedMutator } from "swr";

/**
 * Renders a button to show and edit the permission assignments of a role.
 */
export const ShowPermissionAssignmentModalButton = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#permission-assignment-modal"
              className={`${AwarenessLevel.WARNING} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={faShieldHalved} /> {t("page-operations.role.show-permission-assignments")}
      </button>
    </div>
  )
}

interface PermissionAssignmentModalProps {
  role: RoleModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<RoleModel>;
}

/**
 * Modal window showing the assigned permissions of the given role, also letting to change the assignments.
 *
 * @param role role data
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const PermissionAssignmentModal = ({ role, environment, mutate }: PermissionAssignmentModalProps): ReactNode => {

  const { getAllPermissions } = permissionService(environment);
  const { assignPermission, unassignPermission } = roleService(environment);
  const { t } = useTranslation();
  const [hideUnassigned, setHideUnassigned] = useState(false);
  const [updateInProgressFor, setUpdateInProgressFor] = useState<string | undefined>();
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const { triggerToast } = useContext(PageContext);
  const { showCustomErrorToast } = toastHandler(triggerToast, t);
  const { isLoading: isPermissionListLoading, data: allPermissions } = useSWR("allPermissionsUnpaged", () => getAllPermissions());

  if (isPermissionListLoading) {
    return <InlineLoadingIndicator />;
  }

  const handleAssignment = (target: EventTarget, permission: PermissionModel): void => {

    setUpdateInProgressFor(permission.id);
    const isChecked = (target as HTMLInputElement).checked;
    const operation = isChecked
      ? assignPermission(role.id, permission.id)
      : unassignPermission(role.id, permission.id);

    operation
      .then(updatedEntity => {
        setLastUpdated(permission.id);
        mutate();
        return updatedEntity;
      })
      .catch(_ => showCustomErrorToast(
        t("toast.template.title.failure", {
          domain: t("domain.role"),
          title: role.name
        }),
        t("toast.role.assignment-failed", {
          permission: permission.name,
          role: role.name
        })
      ))
      .finally(() => setUpdateInProgressFor(undefined));
  }

  const isAssigned = (role: RoleModel, permission: PermissionModel): boolean => {

    return role.permissions
      .map(assignedPermission => assignedPermission.id)
      .includes(permission.id);
  }

  const filterPermissions = (permissions?: SimplifiedPageModel<PermissionModel>): PermissionModel[] => {

    if (!hideUnassigned) {
      return permissions?.content ?? [];
    }

    return permissions?.content
      .filter(permission => isAssigned(role, permission)) ?? [];
  }

  return (
    <Modal id={"permission-assignment-modal"} title={t("modal.title.role-permission-assignments", { role: role.name })}
           onClose={() => setLastUpdated(undefined)}>
      <ItemListHeader>
        <p>
          <UnboundSwitch checked={false} label={t("modal.label.permission-assignments.hide-unassigned")}
                         id={"permission-assignments-hide-unassigned"}
                         onClick={() => setHideUnassigned(current => !current)} />
        </p>
        <p className="ml-auto pt-1">{t("role.label.permission-count", {count: role.permissions.length})}</p>
      </ItemListHeader>
      {filterPermissions(allPermissions).map(permission => (
        <ItemListCard key={`permission-assignment-${permission.id}`}>
          <div className="w-11/12">
            <h5 className="text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50">
              {permission.name}
            </h5>
            {permission.description !== null && (
              <>
                <Separator thick={false} />
                <span className="text-xs">
                  <FontAwesomeIcon icon={faStickyNote} /> {permission.description}
                </span>
              </>
            )}
          </div>
          <div className="w-1/12 text-right">
            {updateInProgressFor === permission.id && (
              <SimpleLoadingIndicator sizeOverride={5} />
            )}
            {lastUpdated === permission.id && (
              <FontAwesomeIcon className="w-5 h-5 text-success" icon={faCheck} />
            )}
            <span>&nbsp;</span>
            <UnboundSwitch checked={isAssigned(role, permission)} label={""}
                           id={`switch-permission-assignment-${permission.id}`}
                           onClick={e => handleAssignment(e.target, permission)} />
          </div>
        </ItemListCard>
      ))}
    </Modal>
  );
}
