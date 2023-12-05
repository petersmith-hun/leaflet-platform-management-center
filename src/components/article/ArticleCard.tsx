import { ArticleEnabledStatusFlag, ArticlePublishStatusFlag } from "@/components/article/ArticleStatusFlag";
import { Separator } from "@/components/common/Separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  EditDropdownMenuItem,
  ViewDropdownMenuItem
} from "@/components/navigation/DropdownMenu";
import { OperationButton } from "@/components/navigation/OperationButton";
import { ArticleModel } from "@/core/model/article";
import { dateFormatter } from "@/core/util/date-formatter";
import {
  faAsterisk,
  faCommenting,
  faEdit,
  faFolder,
  faGlobe,
  faUser,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";

interface FormattedArticleDataProps {
  date: string;
  icon: IconDefinition;
}

interface ArticleCardProps {
  article: ArticleModel;
}

/**
 * Renders the given date with a purpose-indicator icon.
 *
 * @param date date (as string) to be rendered
 * @param icon indicator icon as FontAwesome IconDefinition
 */
const FormattedArticleDate = ({ date, icon }: FormattedArticleDataProps): ReactNode => {

  if (!date) {
    return null;
  }

  return (
    <p>
      <FontAwesomeIcon className="w-4" icon={icon} /> {dateFormatter(date)}
    </p>
  )
}

/**
 * Renders an article card to be shown on the article manager's list view.
 *
 * @param article article data to be rendered
 */
export const ArticleCard = ({ article }: ArticleCardProps): ReactNode => {

  return (
    <div
      className="rounded-lg bg-white p-6 mb-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-lg dark:bg-neutral-700 flex md:flex-row flex-col">
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`articles/view/${article.id}`} className="text-primary-400 hover:text-primary-200">
            {article.title}
          </Link>
        </h5>
        <Separator thick={false} />
        <p className="flex flex-row">
          <OperationButton label={article.category.title} icon={faFolder} link={`categories/${article.category.id}`} />
          <OperationButton label={article.user.username} icon={faUser} link={`users/${article.user.id}`} />
        </p>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={article.created} icon={faEdit} />
        <FormattedArticleDate date={article.lastModified} icon={faAsterisk} />
        <FormattedArticleDate date={article.published} icon={faGlobe} />
      </div>
      <div className="w-2/12 text-center">
        <ArticleEnabledStatusFlag article={article} />
        <ArticlePublishStatusFlag article={article} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`article-${article.id}`}>
          <ViewDropdownMenuItem link={`articles/view/${article.id}`} />
          <DropdownMenuItem link={`comments/${article.id}`} icon={faCommenting}
                            label="dropdown.operation.handle-comments" />
          <EditDropdownMenuItem link={`articles/edit/${article.id}`} />
        </DropdownMenu>
      </div>
    </div>
  )
}
