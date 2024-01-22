import { SelectWithHint } from "@/components/form/Select";
import { Role } from "@/core/model/user";
import { TFunction } from "i18next";
import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface RoleSelectorProps {
  registerReturn: UseFormRegisterReturn<"role">;
}

const createRoleMap = (t: TFunction): Record<string, { value: string, hint: string }> => {

  const roleMapEntries = Object.keys(Role)
    .filter(role => role !== Role.EXTERNAL_USER)
    .map(role => [role, {
      value: t(`forms:user.edit.role.${role}`),
      hint: t(`forms:user.edit.role.${role}.hint`)
    }]);

  return Object.fromEntries(roleMapEntries);
}

/**
 * Renders a user role selector, adding the role descriptions as hint to each role option.
 *
 * @param registerReturn React Hook Form registration result
 */
export const RoleSelector = ({ registerReturn }: RoleSelectorProps): ReactNode => {

  const { t } = useTranslation();
  const roleMap = createRoleMap(t);

  return <SelectWithHint registerReturn={registerReturn} label={t("forms:user.edit.role")} optionMap={roleMap} />
}
