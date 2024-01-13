import { ArticlePendingCommentsFlag } from "@/components/article/ArticlePendingCommentsFlag";
import { ArticlePublishStatusFlag } from "@/components/article/ArticleStatusFlag";
import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { Separator } from "@/components/common/Separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  EditDropdownMenuItem,
  ViewDropdownMenuItem
} from "@/components/navigation/DropdownMenu";
import { OperationButton } from "@/components/navigation/OperationButton";
import { ArticleModel } from "@/core/model/article";
import { faAsterisk, faCommenting, faEdit, faFolder, faGlobe, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { ReactNode } from "react";

interface ArticleCardProps {
  article: ArticleModel;
}

/**
 * Renders an article card to be shown on the article manager's list view.
 *
 * @param article article data to be rendered
 */
export const ArticleCard = ({ article }: ArticleCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`articles/view/${article.id}`} className="text-primary-400 hover:text-primary-200">
            {article.title}
          </Link>
        </h5>
        <Separator thick={false} />
        <p className="flex flex-row">
          <OperationButton label={article.category.title} icon={faFolder} link={`categories/view/${article.category.id}`} />
          <OperationButton label={article.user.username} icon={faUser} link={`users/view/${article.user.id}`} />
        </p>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={article.created} icon={faEdit} />
        <FormattedArticleDate date={article.lastModified} icon={faAsterisk} />
        <FormattedArticleDate date={article.published} icon={faGlobe} />
      </div>
      <div className="w-2/12 text-center">
        <ItemEnabledStatusFlag item={article} />
        <ArticlePublishStatusFlag article={article} />
        {(article.pendingCommentCount ?? 0) > 0 && <ArticlePendingCommentsFlag article={article} />}
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`article-${article.id}`}>
          <ViewDropdownMenuItem link={`articles/view/${article.id}`} />
          <DropdownMenuItem link={`comments/${article.id}`} icon={faCommenting}
                            label="dropdown.operation.handle-comments" />
          <EditDropdownMenuItem link={`articles/edit/${article.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
