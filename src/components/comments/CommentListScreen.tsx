import { ScreenParameters } from "@/api-environment";
import { CommentCard } from "@/components/comments/CommentCard";
import { PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { commentFacade } from "@/core/facade/comment-facade";
import { CommentModel, CommentSearchResult } from "@/core/model/comment";
import { commentService } from "@/core/service/comment-service";
import { swrKey, swrNumberKey } from "@/core/util/swr-key";
import { faEye, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

type QueryKey = { articleID: number, page: number };
const pendingCommentsLimit = 3;

interface CommentListResultProps {
  comments: CommentSearchResult;
}

const CommentListResult = ({ comments }: CommentListResultProps): ReactNode => {

  return (
    <ItemListPane pagination={comments.pagination}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.comment.content"} widthClass={"w-8/12"} />
        <ItemListHeaderItem titleKey={"header.comment.dates"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.comment.status"} widthClass={"w-1/12"} />
        <ItemListHeaderItem titleKey={"header.comment.operations"} widthClass={"w-1/12"} />
      </ItemListHeader>
      <ItemListBody data={comments.body.comments}>
        {(comment: CommentModel) => <CommentCard key={`comment-${comment.id}`} comment={comment} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Lists the pending (un-reviewed) comments.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const UnreviewedCommentList = ({ environment }: ScreenParameters): ReactNode => {

  const { getPendingComments } = commentFacade(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const {
    isLoading,
    data,
    error
  } = useSWR(swrNumberKey("comments/pending", router.query.page ?? 1), key => getPendingComments(key.parameter, pendingCommentsLimit));

  if (!data?.body.comments.length) {
    return null;
  }

  return (
    <>
      <MultiPaneScreen>
        <WidePane>
          <SimpleCard>
            <p className="text-warning">
              <FontAwesomeIcon icon={faWarning} /> {t("comments.label.pending-comments")}
            </p>
          </SimpleCard>
        </WidePane>
      </MultiPaneScreen>
      <MultiPaneScreen>
        <SWRManagedScreen isLoading={isLoading} error={error}>
          {() => <CommentListResult comments={data!} />}
        </SWRManagedScreen>
      </MultiPaneScreen>
    </>
  )
}

/**
 * Main screen of comment manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const CommentListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { getPageOfCommentsForArticle } = commentService(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoading, data, error } = useSWR(swrKey<QueryKey>("comments/by-article", {
    articleID: router.query.id,
    page: router.query.page ?? 1
  }), key => getPageOfCommentsForArticle(key.parameter.articleID, key.parameter.page));

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <CommentListResult comments={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.comment")}>
          <PageOperationButton label={t("page-operations.article.view")} icon={faEye}
                               link={`/articles/view/${router.query.id}`} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
