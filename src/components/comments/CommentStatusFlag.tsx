import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { CommentModel } from "@/core/model/comment";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface CommentStatusFlagProps {
  comment: CommentModel;
}

/**
 * Flag component for indicating the status of a comment. Shows a "deleted" indicator if the comment is logically
 * deleted, otherwise it shows the enabled/disabled status flag.
 *
 * @param comment comment data
 */
export const CommentStatusFlag = ({ comment }: CommentStatusFlagProps): ReactNode => {

  return comment.deleted
    ? <FontAwesomeIcon className="w-10 h-10 text-danger" icon={faTrash} />
    : <ItemEnabledStatusFlag item={comment} />;
}
