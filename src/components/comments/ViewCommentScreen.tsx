import { APIEnvironment } from "@/api-environment";
import { CommentStatusFlag } from "@/components/comments/CommentStatusFlag";
import { PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { OperationButton, PageOperationButton } from "@/components/navigation/OperationButton";
import { CommentModel } from "@/core/model/comment";
import { commentService } from "@/core/service/comment-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faFileText, faInfoCircle, faList, faPencil, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewCommentScreenParameters {
  comment: CommentModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<CommentModel>;
}

/**
 * Comment viewer screen component. Renders a static page with all information of the given comment.
 *
 * @param comment data of an existing comment
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewCommentScreen = ({ comment, environment, mutate }: ViewCommentScreenParameters): ReactNode => {

  const { deleteCommentByID, changeGeneralStatus } = commentService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <SimpleCard>
          {comment.deleted && (
            <DataRow>
              <FullWidthDataCell>
                <p className="text-warning">
                  <FontAwesomeIcon icon={faInfoCircle} /> {t("comments.label.deleted")}
                </p>
              </FullWidthDataCell>
            </DataRow>
          )}
          <DataRow>
            <WideDataCell title={t("forms:comment.edit.owner")}>
              <OperationButton label={comment.owner.username} icon={faUser}
                               link={`/users/view/${comment.owner.id}`}
                               additionalClass="mt-2 w-6/12 inline-block" />
            </WideDataCell>
            <NarrowDataCell title={t("forms:comment.edit.general-status")}>
              <CommentStatusFlag comment={comment} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:comment.edit.article")}>
              <OperationButton label={comment.associatedEntry!.title} icon={faFileText}
                               link={`/articles/view/${comment.owner.id}`}
                               additionalClass="mt-2 max-w-10/12 inline-block" />
            </WideDataCell>
            <NarrowDataCell title={t("forms:comment.edit.created-at")} children={dateFormatter(comment.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell children={""} />
            <NarrowDataCell title={t("forms:comment.edit.last-modified-at")}
                            children={dateFormatter(comment.lastModified) ?? t("comments.label.never-modified")} />
          </DataRow>
          {!comment.deleted && (
            <DataRow>
              <FullWidthDataCell title={t("forms:comment.edit.content")}>
                <p className="blockquote">{comment.content}</p>
              </FullWidthDataCell>
            </DataRow>
          )}
        </SimpleCard>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.comment")}>
          <PageOperationButton label={t("page-operations.comment.edit")} icon={faPencil}
                               link={`/comments/edit/${comment.id}`} />
          <PageOperationButton label={t("page-operations.comment.back-to-comments")} icon={faList}
                               link={`/comments/${comment.associatedEntry!.id}`} />
          <GeneralStatusUpdateOperation domain={"comment"} entity={comment} titleSupplier={comment => comment.content}
                                        operation={comment.enabled ? "status-disable" : "status-enable"}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <DeleteOperation domain={"comment"} entity={comment} titleSupplier={comment => comment.content}
                           serviceCall={deleteCommentByID}
                           redirectOverride={comment => `/comments/${comment.associatedEntry!.id}`} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
