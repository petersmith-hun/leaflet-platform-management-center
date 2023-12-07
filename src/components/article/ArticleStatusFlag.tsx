import { ArticleModel, ArticleStatus } from "@/core/model/article";
import { faCheck, faEye, faGlobe, faPencil, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface ArticleFlagProps {
  article: ArticleModel;
}

/**
 * Flag component for indicating the general status of an article.
 *
 * @param article article data to extract the status of the "enabled" value
 */
export const ArticleEnabledStatusFlag = ({ article }: ArticleFlagProps): ReactNode => {

  return article.enabled
    ? <FontAwesomeIcon className="w-10 h-10 text-success" icon={faCheck} />
    : <FontAwesomeIcon className="w-10 h-10 text-danger" icon={faRemove} />;
}

/**
 * Flag component for indicating the publication status of an article.
 *
 * @param article article data to extract the status of the "entryStatus" value
 */
export const ArticlePublishStatusFlag = ({ article }: ArticleFlagProps): ReactNode => {

  switch (article.entryStatus) {
    case ArticleStatus.DRAFT:
      return <FontAwesomeIcon className="w-10 h-10 text-danger ml-3" icon={faPencil} />;
    case ArticleStatus.REVIEW:
      return <FontAwesomeIcon className="w-10 h-10 text-danger ml-3" icon={faEye} />;
    case ArticleStatus.PUBLIC:
      return <FontAwesomeIcon className="w-10 h-10 text-success ml-3" icon={faGlobe} />;
  }
}
