import { Separator } from "@/components/common/Separator";
import {
  DeleteDropdownMenuItem,
  DropdownMenu,
  DropdownMenuItem,
  EditDropdownMenuItem,
  ViewDropdownMenuItem
} from "@/components/navigation/DropdownMenu";
import { OperationButton } from "@/components/navigation/OperationButton";
import { ArticleModel, ArticleStatus } from "@/core/model/article";
import { dateFormatter } from "@/core/util/date-formatter";
import {
  faAsterisk,
  faCheck,
  faCommenting,
  faEdit,
  faEye,
  faFolder,
  faGlobe,
  faPencil,
  faRemove,
  faUser,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

/**
 * TODO.
 * @param date
 * @param icon
 */
const FormattedArticleDate = ({ date, icon }: { date: string, icon: IconDefinition }): ReactNode => {

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
 * TODO.
 * @param article
 */
const ArticleEnabledStatusFlag = (article: ArticleModel): ReactNode => {

  return article.enabled
    ? <FontAwesomeIcon className="w-10 h-10 text-success" icon={faCheck} />
    : <FontAwesomeIcon className="w-10 h-10 text-danger" icon={faRemove} />;
}

/**
 * TODO.
 * @param article
 */
const ArticlePublishStatusFlag = (article: ArticleModel): ReactNode => {

  switch (article.entryStatus) {
    case ArticleStatus.DRAFT:
      return <FontAwesomeIcon className="w-10 h-10 text-danger ml-3" icon={faPencil} />;
    case ArticleStatus.REVIEW:
      return <FontAwesomeIcon className="w-10 h-10 text-danger ml-3" icon={faEye} />;
    case ArticleStatus.PUBLIC:
      return <FontAwesomeIcon className="w-10 h-10 text-success ml-3" icon={faGlobe} />;
  }
}

/**
 * TODO.
 *
 * @param article
 */
export const ArticleCard = (article: ArticleModel): ReactNode => {

  return (
    <div
      className="rounded-lg bg-white p-6 mb-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-lg dark:bg-neutral-700 flex md:flex-row flex-col">
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          {article.title}
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
        <ArticleEnabledStatusFlag {...article} />
        <ArticlePublishStatusFlag {...article} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`article-${article.id}`}>
          <ViewDropdownMenuItem link={`articles/view/${article.id}`} />
          <DropdownMenuItem link={`comments/${article.id}`} icon={faCommenting}
                            label="dropdown.operation.handle-comments" />
          <EditDropdownMenuItem link={`articles/edit/${article.id}`} />
          <DeleteDropdownMenuItem link={`articles/delete/${article.id}`} />
        </DropdownMenu>
      </div>
    </div>
  )
}
