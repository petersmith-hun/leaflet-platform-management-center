import { ToastType } from "@/components/common/OperationResultToast";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { ViewTagScreenParameters } from "@/components/tags/operations/index";
import { toastHandler } from "@/components/utility/toast-handler";
import { TagModel } from "@/core/model/tag";
import tagService from "@/core/service/tag-service";
import { PageContext } from "@/pages/_app";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

/**
 * Component wrapping the deletion logic for tags.
 *
 * @param tag tag data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const TagDeletion = ({ tag, environment, mutate }: ViewTagScreenParameters): ReactNode => {

  const { deleteTagByID } = tagService(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleDeletion = (tag: TagModel): void => {

    setOperationInProgress(true);
    deleteTagByID(tag.id)
      .then(_ => mutate())
      .then(_ => router.push("/tags"))
      .then(_ => showCustomToast(
        t("toast.tag.title.success.updated"),
        t("toast.tag.message.status", {
          title: tag.name,
          status: t("common.deleted")
        }), ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t("toast.tag.title.failure"),
        t("toast.tag.message.failure", {
          title: tag.name
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  return (
    <ConfirmedOperationButton label={t("page-operations.tag.delete")} icon={faPencil}
                              id={`tag-delete-${tag.id}`}
                              onSubmit={() => handleDeletion(tag)}
                              awareness={AwarenessLevel.ALERT} />
  )
}
