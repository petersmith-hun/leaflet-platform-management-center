import { ToastType } from "@/components/common/OperationResultToast";
import { OperationProps, redirectMap } from "@/components/common/operations/index";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { IdentifiedModel } from "@/core/model/common";
import { FileDataModel } from "@/core/model/files";
import { PageContext } from "@/pages/_app";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

interface DeletionProps<ID extends unknown, T extends IdentifiedModel<ID> | FileDataModel> extends OperationProps<T> {
  serviceCall: (id: ID) => Promise<void>;
  idProvider?: (entity: T) => ID;
}

/**
 * Component wrapping the deletion logic for any identifiable entity.
 *
 * @param domain entity group identifier (used for selecting the relevant set of labels, and also for generating IDs)
 * @param entity entity data to be used to extract ID and title
 * @param titleSupplier supplier function to provide the "display name" of the entity
 * @param serviceCall service entry point to execute deletion
 * @param mutate SWR mutate function for data invalidation
 */
export const DeleteOperation = <ID extends unknown, T extends IdentifiedModel<ID> | FileDataModel>(
  { domain, entity, titleSupplier, serviceCall, idProvider = entity => (entity as IdentifiedModel<ID>).id }: DeletionProps<ID, T>): ReactNode => {

  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleDeletion = (): void => {

    setOperationInProgress(true);
    serviceCall(idProvider(entity))
      .then(_ => router.push(redirectMap[domain]))
      .then(_ => showCustomToast(
        t(`toast.template.title.success.updated`, {
          domain: t(`domain.${domain}`)
        }),
        t(`toast.template.message.status`, {
          domain: t(`domain.${domain}`),
          title: titleSupplier(entity),
          status: t("common.deleted")
        }), ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t(`toast.template.title.failure`, {
          domain: t(`domain.${domain}`)
        }),
        t(`toast.template.message.failure`, {
          domain: t(`domain.${domain}`),
          title: titleSupplier(entity)
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  return (
    <ConfirmedOperationButton label={t(`page-operations.${domain}.delete`)} icon={faPencil}
                              id={`${domain}-delete-${idProvider(entity)}`}
                              onSubmit={() => handleDeletion()}
                              awareness={AwarenessLevel.ALERT} />
  )
}
