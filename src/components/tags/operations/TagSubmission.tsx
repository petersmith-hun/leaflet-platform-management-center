import { APIEnvironment } from "@/api-environment";
import { toastHandler } from "@/components/utility/toast-handler";
import { TagEditRequest, TagModel } from "@/core/model/tag";
import tagService from "@/core/service/tag-service";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface TagSubmissionProps {
  environment: APIEnvironment;
  handleSubmit: UseFormHandleSubmit<TagEditRequest>;
  children: ReactNode;
  mutate?: KeyedMutator<TagModel>;
}

/**
 * Component wrapping the tag submission logic.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param handleSubmit React Hook Form submission handler function
 * @param children contents to be rendered within
 * @param mutate SWR mutate function for data invalidation
 */
export const TagSubmission = ({ environment, handleSubmit, children, mutate }: TagSubmissionProps): ReactNode => {

  const { createTag, editTag } = tagService(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, handleAxiosError } = toastHandler(triggerToast, t);
  const tagID = router.query.id as number | undefined;

  const onSubmit: SubmitHandler<TagEditRequest> = (data) => {
    setOperationInProgress(true);

    const result = tagID
      ? editTag(tagID, data)
      : createTag(data);

    result
      .then(tag => {
        mutate && mutate();
        return tag;
      })
      .then(tag => router.push(`/tags/view/${tag.id}`))
      .then(() => showCustomToast(
        t(tagID
          ? "toast.tag.title.success.updated"
          : "toast.tag.title.success.created"),
        t("toast.tag.message.status", {
          title: data.name,
          status: t(tagID ? "common.updated" : "common.created")
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
