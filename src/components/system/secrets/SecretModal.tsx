import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { Modal } from "@/components/common/Modal";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { faCheck, faCopy, faEye, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

interface CopySecretButtonProps {
  value: string;
}

interface SecretModalProps {
  title: string;
  value: ReactNode | string | null;
  onClose: () => Promise<void>;
}

interface LocalPageOperationButtonProperties {
  onClick: () => void;
}

interface SecretRetrievalErrorProps {
  axiosError: AxiosError;
}

const CopySecretButton = ({ value }: CopySecretButtonProps): ReactNode => {

  const [icon, setIcon] = useState(faCopy);
  const { t } = useTranslation();

  const handleCopy = () => navigator.clipboard
    .writeText(value)
    .then(() => setIcon(faCheck));

  return (
    <div className="mb-3 w-full flex flex-col items-end">
      <button type="button"
              title={t("page-operations.secret.copy")}
              className={`border-success text-left inline-block rounded border-2 px-3 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={handleCopy}>
        <FontAwesomeIcon className="w-4 h-4" icon={icon} />
      </button>
    </div>
  )
}

/**
 * Modal window to show a retrieved secret.
 *
 * @param title modal window title
 * @param value value of the secret to show in the modal
 * @param onClose additional operations to execute on close
 */
export const SecretModal = ({ title, value, onClose }: SecretModalProps) => {

  return (
    <Modal id={"secret-modal"} title={title} onClose={onClose}>
      {!value && (
        <InlineLoadingIndicator />
      )}
      {value && (
        <p className="flex flex-row">
          <pre className="blockquote">{value}</pre>
          {typeof value === "string" && (
            <CopySecretButton value={value as string} />
          )}
        </p>
      )}
    </Modal>
  )
}

/**
 * Error indicator to be shown if secret retrieval fails.
 *
 * @param axiosError Axios-raised error object
 */
export const SecretRetrievalError = ({ axiosError }: SecretRetrievalErrorProps): ReactNode => {

  const { t } = useTranslation();

  const errorMessage = (axiosError?.response?.data as any)?.message ?? axiosError?.message;

  return (
    <span className="text-warning">
      <FontAwesomeIcon icon={faWarning} /> {t("system.secrets.label.retrieval-failure", { message: errorMessage })}
    </span>
  )
}

/**
 * Page operation button to trigger secret retrieval.
 *
 * @param onClick operation to execute secret retrieval
 */
export const RetrieveSecretButton = ({ onClick }: LocalPageOperationButtonProperties): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#secret-modal"
              className={`${AwarenessLevel.WARNING} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={onClick}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={faEye} /> {t("system.secrets.label.show-secret")}
      </button>
    </div>
  )
}
