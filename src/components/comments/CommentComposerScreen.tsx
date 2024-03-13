import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { CommentEditRequest, CommentModel } from "@/core/model/comment";
import { commentService } from "@/core/service/comment-service";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface CommentComposerScreenProps {
  environment: APIEnvironment;
  comment: CommentModel;
  mutate?: KeyedMutator<CommentModel>;
}

/**
 * Screen used by comment manager's create/edit operations. Since comment creation is not supported, always provide the
 * comment itself, as well as an SWR mutate function to invalidate the cache for the edited comment.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param comment comment data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const CommentComposerScreen = ({ environment, comment, mutate }: CommentComposerScreenProps): ReactNode => {

  const { editComment } = commentService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<CommentEditRequest>({
    defaultValues: comment
  });
  const router = useRouter();
  const commentID = router.query.id as unknown as number;

  return (
    <SubmitOperation domain={"comment"} mutate={mutate} titleSupplier={comment => comment.content}
                     handleSubmit={handleSubmit}
                     serviceCall={entity => editComment(commentID, entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={t("page.title.comment.edit")}>
            <DataRow>
              <WideDataCell>
                <Textarea registerReturn={register("content", { required: t("forms:validation.common.required") })}
                          label={t("forms:comment.edit.content")} id={"comment-content"}
                          errorSupplier={() => errors.content?.message} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.comment")}>
            <PageOperationButton label={t("page-operations.comment.view")} icon={faEye}
                                 link={`/comments/view/${commentID}`} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
