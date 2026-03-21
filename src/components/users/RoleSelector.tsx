import { SelectWithHint } from "@/components/form/Select";
import { RoleModel } from "@/core/model/role";
import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface RoleSelectorProps {
  registerReturn: UseFormRegisterReturn<"roleID">;
  roles: RoleModel[];
}

const createRoleMap = (roles: RoleModel[]): Record<string, { value: string, hint: string }> => {

  const roleMapEntries = roles
    .filter(role => !role.externalDefault)
    .map(role => [role.id, {
      value: role.name,
      hint: role.description
    }]);

  return Object.fromEntries(roleMapEntries);
}

/**
 * Renders a user role selector, adding the role descriptions as hint to each role option.
 *
 * @param registerReturn React Hook Form registration result
 * @param roles available roles
 */
export const RoleSelector = ({ registerReturn, roles }: RoleSelectorProps): ReactNode => {

  const { t } = useTranslation();
  const roleMap = createRoleMap(roles);

  return <SelectWithHint registerReturn={registerReturn} label={t("forms:user.edit.role")} optionMap={roleMap} />
}
