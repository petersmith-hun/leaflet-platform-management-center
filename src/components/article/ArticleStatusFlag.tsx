import { ArticleModel, ArticleStatus } from "@/core/model/article";
import { faCheck, faEye, faGlobe, faPencil, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

/**
 * TODO.
 * @param article
 */
export const ArticleEnabledStatusFlag = (article: ArticleModel): ReactNode => {

  return article.enabled
    ? <FontAwesomeIcon className="w-10 h-10 text-success" icon={faCheck} />
    : <FontAwesomeIcon className="w-10 h-10 text-danger" icon={faRemove} />;
}

/**
 * TODO.
 * @param article
 */
export const ArticlePublishStatusFlag = (article: ArticleModel): ReactNode => {

  switch (article.entryStatus) {
    case ArticleStatus.DRAFT:
      return <FontAwesomeIcon className="w-10 h-10 text-danger ml-3" icon={faPencil} />;
    case ArticleStatus.REVIEW:
      return <FontAwesomeIcon className="w-10 h-10 text-danger ml-3" icon={faEye} />;
    case ArticleStatus.PUBLIC:
      return <FontAwesomeIcon className="w-10 h-10 text-success ml-3" icon={faGlobe} />;
  }
}
