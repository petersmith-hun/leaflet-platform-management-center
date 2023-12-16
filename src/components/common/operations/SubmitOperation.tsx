import { OperationDomain, redirectMap } from "@/components/common/operations/index";
import { toastHandler } from "@/components/utility/toast-handler";
import { IdentifiedModel } from "@/core/model/common";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { FieldValues, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface SubmitOperationProps<ID extends unknown, T extends FieldValues> {
  domain: OperationDomain;
  titleSupplier: (entity: T) => string;
  serviceCall: (entity: T) => Promise<IdentifiedModel<ID>>;
  handleSubmit: UseFormHandleSubmit<T>;
  mutate?: KeyedMutator<any>;
  children: ReactNode | ReactNode[];
}

/**
 * Component wrapping the submission logic for any entity created as an identified model.
 *
 * @param domain entity group identifier (used for selecting the relevant set of labels)
 * @param titleSupplier supplier function to provide the "display name" of the entity
 * @param serviceCall service entry point to execute submission
 * @param handleSubmit React Hook Form submission handler function
 * @param mutate SWR mutate function for data invalidation
 * @param children contents to be rendered within
 */
export const SubmitOperation = <ID extends unknown, T extends FieldValues>(
  { domain, titleSupplier, serviceCall, handleSubmit, mutate, children }: SubmitOperationProps<ID, T>): ReactNode => {

  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, handleAxiosError } = toastHandler(triggerToast, t);
  const entityID = router.query.id as number | undefined;

  const onSubmit: SubmitHandler<T> = (request: T) => {

    setOperationInProgress(true);
    serviceCall(request)
      .then(entity => {
        mutate && mutate();
        return entity;
      })
      .then(entity => router.push(`${redirectMap[domain]}/view/${entity.id}`))
      .then(() => showCustomToast(
        t(entityID
          ? `toast.template.title.success.updated`
          : `toast.template.title.success.created`, {
          domain: t(`domain.${domain}`)
        }),
        t("toast.template.message.status", {
          domain: t(`domain.${domain}`),
          title: titleSupplier(request),
          status: t(entityID ? "common.updated" : "common.created")
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
