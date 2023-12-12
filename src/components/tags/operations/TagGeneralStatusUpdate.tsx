import { ToastType } from "@/components/common/OperationResultToast";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { ViewTagScreenParameters } from "@/components/tags/operations/index";
import { toastHandler } from "@/components/utility/toast-handler";
import { TagModel } from "@/core/model/tag";
import tagService from "@/core/service/tag-service";
import { PageContext } from "@/pages/_app";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

/**
 * Component wrapping the general status change logic for tags.
 *
 * @param tag tag data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const TagGeneralStatusUpdate = ({ tag, environment, mutate }: ViewTagScreenParameters): ReactNode => {

  const { changeGeneralStatus } = tagService(environment);
  const { t } = useTranslation();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleGeneralStatusChange = (tag: TagModel): void => {

    setOperationInProgress(true);
    changeGeneralStatus(tag.id)
      .then(_ => mutate())
      .then(currentTag => showCustomToast(
        t("toast.tag.title.success.updated"),
        t("toast.tag.message.status", {
          title: tag.name,
          status: t(currentTag!.enabled ? "common.enabled" : "common.disabled")
        }),
        currentTag!.enabled
          ? ToastType.SUCCESS
          : ToastType.WARNING
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
    <>
      {tag.enabled &&
        <ConfirmedOperationButton label={t("page-operations.tag.disable")}
                                  icon={faToggleOff}
                                  id={`tag-general-status-${tag.id}`}
                                  onSubmit={() => handleGeneralStatusChange(tag)}
                                  awareness={AwarenessLevel.ALERT} />}
      {!tag.enabled &&
        <ConfirmedOperationButton label={t("page-operations.tag.enable")}
                                  icon={faToggleOn}
                                  id={`tag-general-status-${tag.id}`}
                                  onSubmit={() => handleGeneralStatusChange(tag)}
                                  awareness={AwarenessLevel.POSITIVE} />}
    </>
  )
}
