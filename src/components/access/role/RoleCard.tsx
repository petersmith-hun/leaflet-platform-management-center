import { MarkedAsDefaultFlag } from "@/components/access/role/commons";
import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { RoleModel } from "@/core/model/role";
import { faAsterisk, faEdit, faShieldHalved, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface RoleCardProps {
  role: RoleModel;
}

/**
 * Renders a role card to be shown on the role manager's list view.
 *
 * @param role role data to be rendered
 */
export const RoleCard = ({ role }: RoleCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/access/roles/view/${role.id}`} className="text-primary-400 hover:text-primary-200">
            {role.name}
          </Link>
        </h5>
        <Separator thick={false} />
        <span className="text-xs">
          <FontAwesomeIcon icon={faShieldHalved} /> {t("role.label.permission-count", {count: role.permissions.length})}
        </span>
        {role.description !== null && (
          <>
            <br />
            <span className="text-xs">
              <FontAwesomeIcon icon={faStickyNote} /> {role.description}
            </span>
          </>
        )}
      </div>
      <div className="w-3/12 text-center">
        <ItemEnabledStatusFlag item={role} />
        <MarkedAsDefaultFlag flag={"local"} role={role} />
        <MarkedAsDefaultFlag flag={"external"} role={role} />
      </div>
      <div className="w-2/12 text-sm text-neutral-300">
        <FormattedArticleDate date={role.created} icon={faEdit} />
        <FormattedArticleDate date={role.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`role-${role.id}`}>
          <ViewDropdownMenuItem link={`/access/roles/view/${role.id}`} />
          <EditDropdownMenuItem link={`/access/roles/edit/${role.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
