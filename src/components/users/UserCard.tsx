import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { DropdownMenu, DropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { UserModel } from "@/core/model/user";
import { faAsterisk, faEdit, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface UserCardProps {
  user: UserModel;
}

/**
 * Renders a user card to be shown on the user manager's list view.
 *
 * @param user user data to be rendered
 */
export const UserCard = ({ user }: UserCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`users/view/${user.id}`} className="text-primary-400 hover:text-primary-200">
            {user.username}
          </Link>
        </h5>
        <span>{user.email}</span>
      </div>
      <div className="w-2/12">
        {t(`forms:user.edit.role.${user.role}`)}
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={user.created} icon={faEdit} />
        <FormattedArticleDate date={user.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`user-${user.id}`}>
          <ViewDropdownMenuItem link={`users/view/${user.id}`} />
          <DropdownMenuItem icon={faUserGroup} label={"dropdown.operation.user.change-role"}
                            link={`users/edit/role/${user.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
