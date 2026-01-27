import { OptionWithHintRecord, SelectWithHint } from "@/components/form/Select";
import { PermissionModel } from "@/core/model/permission";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CountManipulationButtonProps {
  increase: boolean;
  counterStateSetter: Dispatch<SetStateAction<number>>;
  labelKey?: string;
  callback?: () => void;
}

/**
 * Button to increase/decrease the count of inputs or input groups for form segments having an arbitrary number of related entities of the same kind.
 *
 * @param increase flag to indicate the button is supposed to increase the number of the related form segment
 * @param counterStateSetter setter function of the related counter
 * @param labelKey optional button label
 * @param callback action to execute on click
 */
export const CountManipulationButton = ({ increase, counterStateSetter, labelKey, callback }: CountManipulationButtonProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <button type="button"
              className={`w-9 h-9 mr-2 rounded border-2 px-2 py-1 transition duration-150 ease-in-out hover:bg-opacity-10 ${increase
                ? "hover:border-primary-accent-100 hover:bg-neutral-500"
                : "hover:border-danger-600 hover:bg-danger-500 border-danger-500 text-danger-500 hover:text-danger-600"}`}
              onClick={() => {
                callback && callback();
                counterStateSetter(current => increase ? current + 1 : current - 1);
              }}>
        <FontAwesomeIcon icon={increase ? faPlus : faTrash} />
      </button> {labelKey ? t(labelKey) : null}
    </>
  )
}

const mapPermissionsToOptions = (permissions: PermissionModel[]): OptionWithHintRecord => {

  return Object.fromEntries(permissions.map(permission =>
    [permission.id, { value: permission.name, hint: permission.description }]
  ));
}

interface PermissionSelectorProps {
  permissions: PermissionModel[],
  registerReturn: UseFormRegisterReturn,
  labelKey: string
}

/**
 * Extension of the SelectWithHint form input for permission, showing the permission names along with the relevant descriptions.
 * Allows selecting multiple permissions at once, and adds a search input if there are more than 4 permissions available.
 *
 * @param permissions selectable permissions
 * @param registerReturn form registration hook
 * @param labelKey label key to show
 */
export const PermissionSelector = ({ permissions, registerReturn, labelKey }: PermissionSelectorProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <SelectWithHint optionMap={mapPermissionsToOptions(permissions)} multiple={true} registerReturn={registerReturn}
                    label={t(labelKey)} search={permissions.length > 4} />
  )
}
