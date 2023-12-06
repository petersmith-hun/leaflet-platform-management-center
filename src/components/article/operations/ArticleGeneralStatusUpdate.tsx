import { ViewArticleScreenParameters } from "@/components/article/operations/index";
import { ToastType } from "@/components/common/OperationResultToast";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { ArticleModel } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";
import articleService from "@/core/service/article-service";
import { PageContext } from "@/pages/_app";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

/**
 * Component wrapping the general status change logic for articles.
 *
 * @param article article data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ArticleGeneralStatusUpdate = ({ article, environment, mutate }: ViewArticleScreenParameters): ReactNode => {

  const { changeGeneralStatus } = articleService(environment);
  const { t } = useTranslation();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleGeneralStatusChange = (article: ResponseWrapper<ArticleModel>): void => {

    setOperationInProgress(true);
    changeGeneralStatus(article.body.id)
      .then(_ => mutate())
      .then(currentArticle => showCustomToast(
        t("toast.article.title.success.updated"),
        t("toast.article.message.status", {
          title: article.body.title,
          status: t(currentArticle!.body.enabled ? "common.enabled" : "common.disabled")
        }),
        currentArticle!.body.enabled
          ? ToastType.SUCCESS
          : ToastType.WARNING
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
    <>
      {article.body.enabled &&
				<ConfirmedOperationButton label={t("page-operations.article.disable")} icon={faToggleOff}
																	id={`article-general-status-${article.body.id}`}
																	onSubmit={() => handleGeneralStatusChange(article)}
																	awareness={AwarenessLevel.ALERT} />}
      {!article.body.enabled &&
				<ConfirmedOperationButton label={t("page-operations.article.enable")} icon={faToggleOn}
																	id={`article-general-status-${article.body.id}`}
																	onSubmit={() => handleGeneralStatusChange(article)}
																	awareness={AwarenessLevel.POSITIVE} />}
    </>
  )
}
