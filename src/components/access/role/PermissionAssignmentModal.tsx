import { APIEnvironment } from "@/api-environment";
import { ItemListCard } from "@/components/common/Cards";
import { InlineLoadingIndicator, SimpleLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { ItemListHeader } from "@/components/common/ItemListPane";
import { Modal } from "@/components/common/Modal";
import { Separator } from "@/components/common/Separator";
import { UnboundSwitch } from "@/components/form/Switch";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { toastHandler } from "@/components/utility/toast-handler";
import { SimplifiedPageModel } from "@/core/model/common";
import { PermissionModel } from "@/core/model/permission";
import { RoleModel } from "@/core/model/role";
import { permissionService } from "@/core/service/permissions-service";
import { roleService } from "@/core/service/roles-service";
import { PageContext } from "@/pages/_app";
import { faCheck, faShieldHalved, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
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

interface PermissionFilterInputProps {
  setFilter: Dispatch<SetStateAction<string | undefined>>;
}

const PermissionFilterInput = ({ setFilter }: PermissionFilterInputProps): ReactNode => {

  const { t } = useTranslation();

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Input]));
  }, []);

  return (
    <div className="ml-2 max-w-[90%]">
      <div className="relative" data-te-input-wrapper-init="">
        <input type={"text"}
               className="read-only:dark:bg-neutral-600 peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
               id={"permission-filter"}
               placeholder={t("role.label.permission-assignment-filter")}
               onChange={event => setFilter(event.target?.value?.toLowerCase())}/>
        <label htmlFor={"permission-filter"}
               className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
          {t("role.label.permission-assignment-filter")}
        </label>
      </div>
    </div>
  )
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
  const [filter, setFilter] = useState<string | undefined>();
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

  const filterPermissions = (permissions: SimplifiedPageModel<PermissionModel> | undefined, filter: string | undefined): PermissionModel[] => {

    return (permissions?.content ?? [])
      .filter(permission => filter
        ? (permission.name.toLowerCase().includes(filter) || permission.description?.toLowerCase()?.includes(filter))
        : true)
      .filter(permission => hideUnassigned
        ? isAssigned(role, permission)
        : true);
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
        <p>
          <PermissionFilterInput setFilter={setFilter} />
        </p>
        <p className="ml-auto pt-1">{t("role.label.permission-count", {count: role.permissions.length})}</p>
      </ItemListHeader>
      {filterPermissions(allPermissions, filter).map(permission => (
        <ItemListCard key={`permission-assignment-${permission.id}`}>
          <div className="w-11/12">
            <h5 className="text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50">
              {permission.name}
            </h5>
            {permission.description && (
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
