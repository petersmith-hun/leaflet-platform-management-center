import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { CategoryModel } from "@/core/model/category";
import { faAsterisk, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { ReactNode } from "react";

interface CategoryCardProps {
  category: CategoryModel;
}

/**
 * Renders a category card to be shown on the category manager's list view.
 *
 * @param category category data to be rendered
 */
export const CategoryCard = ({ category }: CategoryCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`categories/view/${category.id}`} className="text-primary-400 hover:text-primary-200">
            {category.title}
          </Link>
        </h5>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={category.created} icon={faEdit} />
        <FormattedArticleDate date={category.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 text-center">
        <ItemEnabledStatusFlag item={category} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`category-${category.id}`}>
          <ViewDropdownMenuItem link={`categories/view/${category.id}`} />
          <EditDropdownMenuItem link={`categories/edit/${category.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
