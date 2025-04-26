import { ToastType } from "@/components/common/OperationResultToast";
import { OperationProps, OperationType, sanitizeID } from "@/components/common/operations/index";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";
import { PageContext } from "@/pages/_app";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface GeneralStatusUpdateProps<ID extends unknown, T extends IdentifiedSelfStatusAwareModel<ID>> extends OperationProps<T> {
  operation: OperationType;
  serviceCall: (id: ID) => Promise<T>;
  mutate: KeyedMutator<any>;
}

/**
 * Component wrapping the general status change logic for any self-status-aware entity.
 *
 * @param domain entity group identifier (used for selecting the relevant set of labels, and also for generating IDs)
 * @param operation operation label
 * @param entity entity data to be used to extract status information, ID and title
 * @param titleSupplier supplier function to provide the "display name" of the entity
 * @param serviceCall service entry point to execute status update
 * @param mutate SWR mutate function for data invalidation
 */
export const GeneralStatusUpdateOperation = <ID extends unknown, T extends IdentifiedSelfStatusAwareModel<ID>>(
  { domain, operation, entity, titleSupplier, serviceCall, mutate }: GeneralStatusUpdateProps<ID, T>): ReactNode => {

  const { t } = useTranslation();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleGeneralStatusChange = (): void => {

    setOperationInProgress(true);
    serviceCall(entity.id)
      .then(updatedEntity => {
        mutate();
        return updatedEntity;
      })
      .then(updatedEntity => showCustomToast(
        t(`toast.template.title.success.updated`, {
          domain: t(`domain.${domain}`)
        }),
        t(`toast.template.message.status`, {
          domain: t(`domain.${domain}`),
          title: titleSupplier(entity),
          status: t(updatedEntity.enabled ? "common.enabled" : "common.disabled")
        }),
        updatedEntity.enabled
          ? ToastType.SUCCESS
          : ToastType.WARNING
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
    <>
      {entity.enabled &&
        <ConfirmedOperationButton label={t(`page-operations.${domain}.disable`)} icon={faToggleOff}
                                  popconfirmDomain={domain === "secret-retrieval" ? "secret" : domain} operation={operation}
                                  id={sanitizeID(`${domain}-general-status-${entity.id}`)}
                                  onSubmit={() => handleGeneralStatusChange()}
                                  awareness={AwarenessLevel.ALERT} />}
      {!entity.enabled &&
        <ConfirmedOperationButton label={t(`page-operations.${domain}.enable`)} icon={faToggleOn}
                                  popconfirmDomain={domain === "secret-retrieval" ? "secret" : domain} operation={operation}
                                  id={sanitizeID(`${domain}-general-status-${entity.id}`)}
                                  onSubmit={() => handleGeneralStatusChange()}
                                  awareness={AwarenessLevel.POSITIVE} />}
    </>
  )
}
