import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { PermissionModel } from "@/core/model/permission";
import { faAsterisk, faEdit, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";

interface PermissionCardProps {
  permission: PermissionModel;
}

/**
 * Renders a permission card to be shown on the permission manager's list view.
 *
 * @param permission permission data to be rendered
 */
export const PermissionCard = ({ permission }: PermissionCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/access/permissions/view/${permission.id}`} className="text-primary-400 hover:text-primary-200">
            {permission.name}
          </Link>
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
      <div className="w-2/12 text-center">
        <ItemEnabledStatusFlag item={permission} />
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={permission.created} icon={faEdit} />
        <FormattedArticleDate date={permission.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`permission-${permission.id}`}>
          <ViewDropdownMenuItem link={`/access/permissions/view/${permission.id}`} />
          <EditDropdownMenuItem link={`/access/permissions/edit/${permission.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
