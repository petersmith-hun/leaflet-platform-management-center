import { RoleModel } from "@/core/model/role";
import { faBuildingUser, faHomeUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type RoleFlag = "local" | "external";

interface MarkedAsDefaultFlagProps {
  role: RoleModel;
  flag: RoleFlag;
}

/**
 * Identifies if the given role is default for the given flag.
 *
 * @param role role to check
 * @param flag flag to check role for
 */
export const isDefaultAs = (role: RoleModel, flag: RoleFlag): boolean => {

  return flag === "local"
    ? role.localDefault
    : role.externalDefault;
}

/**
 * Renders a relevant default role marker for the requested flag.
 *
 * @param role role to check
 * @param flag flag to check role for
 */
export const MarkedAsDefaultFlag = ({ role, flag }: MarkedAsDefaultFlagProps): ReactNode => {

  const { t } = useTranslation();

  if (!isDefaultAs(role, flag)) {
    return null;
  }

  return <FontAwesomeIcon className="ml-2 w-10 h-10 text-success"
                          title={t(flag === "local" ? "toast.role.marked-as-local-default" : "toast.role.marked-as-external-default", { role: role.name })}
                          icon={flag === "local" ? faHomeUser : faBuildingUser} />;
}

