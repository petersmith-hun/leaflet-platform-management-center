import { CommentStatusFlag } from "@/components/comments/CommentStatusFlag";
import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { OperationButton } from "@/components/navigation/OperationButton";
import { CommentModel } from "@/core/model/comment";
import { faAsterisk, faEdit, faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface CommentCardProps {
  comment: CommentModel;
}

/**
 * Renders a comment card to be shown on the comment manager's list view.
 *
 * @param comment comment data to be rendered
 */
export const CommentCard = ({ comment }: CommentCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className={`${comment.deleted ? "opacity-30" : null}`}>
      <ItemListCard>
        <div className={`w-8/12`}>
          {!comment.deleted && (
            <p className="blockquote">
              {comment.content}
            </p>
          )}
          {comment.deleted && (
            <p>
              <FontAwesomeIcon icon={faInfoCircle} /> {t("comments.label.deleted")}
            </p>
          )}
          <Separator thick={false} />
          <p className="flex flex-row">
            <OperationButton label={comment.owner.username} icon={faUser} link={`/users/view/${comment.owner.id}`} />
          </p>
        </div>
        <div className="w-2/12 text-sm text-neutral-300">
          <FormattedArticleDate date={comment.created} icon={faEdit} />
          <FormattedArticleDate date={comment.lastModified} icon={faAsterisk} />
        </div>
        <div className="w-1/12 text-center">
          <CommentStatusFlag comment={comment} />
        </div>
        <div className="w-1/12 flex flex-col items-end">
          <DropdownMenu id={`comment-${comment.id}`}>
            <ViewDropdownMenuItem link={`/comments/view/${comment.id}`} />
            <EditDropdownMenuItem link={`/comments/edit/${comment.id}`} />
          </DropdownMenu>
        </div>
      </ItemListCard>
    </div>
  )
}
