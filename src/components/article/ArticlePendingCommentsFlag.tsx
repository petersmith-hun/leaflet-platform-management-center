import { ArticleModel } from "@/core/model/article";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

/**
 * Flag component indicating that the article has pending comments, including the number of those.
 *
 * @param article article data to extract the number of pending comments from
 */
export const ArticlePendingCommentsFlag = ({ article }: { article: ArticleModel }): ReactNode => {

  return (
    <span>
      <FontAwesomeIcon className="w-10 h-10 text-warning ml-3" icon={faCommentDots} />
      <span className="text-warning text-xs">{article.pendingCommentCount}</span>
    </span>
  )
}
