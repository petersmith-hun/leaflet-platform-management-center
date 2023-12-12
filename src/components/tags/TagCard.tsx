import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { TagModel } from "@/core/model/tag";
import { faAsterisk, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { ReactNode } from "react";

interface TagCardProps {
  tag: TagModel;
}

/**
 * Renders a tag card to be shown on the tag manager's list view.
 *
 * @param tag tag data to be rendered
 */
export const TagCard = ({ tag }: TagCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`tags/view/${tag.id}`} className="text-primary-400 hover:text-primary-200">
            {tag.name}
          </Link>
        </h5>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={tag.created} icon={faEdit} />
        <FormattedArticleDate date={tag.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 text-center">
        <ItemEnabledStatusFlag item={tag} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`tag-${tag.id}`}>
          <ViewDropdownMenuItem link={`tags/view/${tag.id}`} />
          <EditDropdownMenuItem link={`tags/edit/${tag.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
