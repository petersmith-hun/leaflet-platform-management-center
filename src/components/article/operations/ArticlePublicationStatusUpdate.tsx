import { ViewArticleScreenParameters } from "@/components/article";
import { ToastType } from "@/components/common/OperationResultToast";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { ArticleModel, ArticleStatus } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";
import articleService from "@/core/service/article-service";
import { PageContext } from "@/pages/_app";
import { faBan, faEye, faGlobe } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

/**
 * Component wrapping the publication status change logic for articles.
 *
 * @param article article data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ArticlePublicationStatusUpdate = ({ article, environment, mutate }: ViewArticleScreenParameters): ReactNode => {

  const { changePublicationStatus } = articleService(environment);
  const { t } = useTranslation();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handlePublicationStatusChange = (article: ResponseWrapper<ArticleModel>): void => {

    setOperationInProgress(true);
    changePublicationStatus(article.body.id, article.body.entryStatus)
      .then(_ => mutate())
      .then(currentArticle => showCustomToast(
        t("toast.template.title.success.updated", {
          domain: t(`domain.article`)
        }),
        t("toast.template.message.status", {
          domain: t(`domain.article`),
          title: article.body.title,
          status: t(`toast.article.message.status.publication.${currentArticle!.body.entryStatus}`)
        }),
        currentArticle!.body.entryStatus === ArticleStatus.PUBLIC
          ? ToastType.SUCCESS
          : ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t("toast.template.title.failure", {
          domain: t(`domain.article`)
        }),
        t("toast.template.message.failure", {
          domain: t(`domain.article`),
          title: article.body.title
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  return (
    <>
      {article.body.entryStatus === ArticleStatus.PUBLIC &&
        <ConfirmedOperationButton label={t("page-operations.article.unpublish")} icon={faBan}
                                  id={`article-publication-${article.body.id}`}
                                  onSubmit={() => handlePublicationStatusChange(article)}
                                  awareness={AwarenessLevel.ALERT} />}
      {article.body.entryStatus === ArticleStatus.REVIEW &&
        <ConfirmedOperationButton label={t("page-operations.article.publish")} icon={faGlobe}
                                  id={`article-publication-${article.body.id}`}
                                  onSubmit={() => handlePublicationStatusChange(article)}
                                  awareness={AwarenessLevel.POSITIVE} />}
      {article.body.entryStatus === ArticleStatus.DRAFT &&
        <ConfirmedOperationButton label={t("page-operations.article.request-review")} icon={faEye}
                                  id={`article-publication-${article.body.id}`}
                                  onSubmit={() => handlePublicationStatusChange(article)}
                                  awareness={AwarenessLevel.WARNING} />}
    </>
  )
}
