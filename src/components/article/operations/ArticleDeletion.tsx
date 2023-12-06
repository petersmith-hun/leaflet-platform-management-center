import { ViewArticleScreenParameters } from "@/components/article/operations/index";
import { ToastType } from "@/components/common/OperationResultToast";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { ArticleModel } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";
import articleService from "@/core/service/article-service";
import { PageContext } from "@/pages/_app";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

/**
 * Component wrapping the deletion logic for articles.
 *
 * @param article article data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ArticleDeletion = ({ article, environment, mutate }: ViewArticleScreenParameters): ReactNode => {

  const { deleteArticleByID } = articleService(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleDeletion = (article: ResponseWrapper<ArticleModel>): void => {

    setOperationInProgress(true);
    deleteArticleByID(article.body.id)
      .then(_ => mutate())
      .then(_ => router.push("/articles"))
      .then(_ => showCustomToast(
        t("toast.article.title.success.updated"),
        t("toast.article.message.status", {
          title: article.body.title,
          status: t("common.deleted")
        }), ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t("toast.article.title.failure"),
        t("toast.article.message.failure", {
          title: article.body.title
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  return (
    <ConfirmedOperationButton label={t("page-operations.article.delete")} icon={faPencil}
                              id={`article-delete-${article.body.id}`}
                              onSubmit={() => handleDeletion(article)}
                              awareness={AwarenessLevel.ALERT} />
  )
}
