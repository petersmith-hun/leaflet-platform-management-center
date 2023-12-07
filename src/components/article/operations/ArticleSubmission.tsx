import { APIEnvironment } from "@/api-environment";
import { toastHandler } from "@/components/utility/toast-handler";
import { articleComposerFacade } from "@/core/facade/article-composer-facade";
import { ArticleComposerCommonData, ArticleEditRequest } from "@/core/model/article";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ArticleSubmissionProps {
  environment: APIEnvironment;
  handleSubmit: UseFormHandleSubmit<ArticleEditRequest>;
  children: ReactNode;
  mutate?: KeyedMutator<ArticleComposerCommonData>;
}

/**
 * Component wrapping the article submission logic.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param handleSubmit React Hoom Form submission handler function
 * @param children contents to be rendered within
 * @param mutate SWR mutate function for data invalidation
 */
export const ArticleSubmission = ({ environment, handleSubmit, children, mutate }: ArticleSubmissionProps): ReactNode => {

  const { submitArticle } = articleComposerFacade(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, handleAxiosError } = toastHandler(triggerToast, t);
  const articleID = router.query.id as number | undefined;

  const onSubmit: SubmitHandler<ArticleEditRequest> = (data) => {
    setOperationInProgress(true);
    data = { ...data, tags: data.tags.map(id => parseInt(id as unknown as string)) };
    submitArticle(data, articleID)
      .then(articleID => {
        mutate && mutate();
        return articleID;
      })
      .then(articleID => router.push(`/articles/view/${articleID}`))
      .then(() => showCustomToast(
        t(articleID
          ? "toast.article.title.success.updated"
          : "toast.article.title.success.created"),
        t("toast.article.message.status", {
          title: data.title,
          status: t(articleID ? "common.updated" : "common.created")
        })))
      .catch(handleAxiosError)
      .finally(() => setOperationInProgress(false));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {children}
    </form>
  )
}
