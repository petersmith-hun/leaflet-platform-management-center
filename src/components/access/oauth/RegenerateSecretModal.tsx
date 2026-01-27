import { APIEnvironment } from "@/api-environment";
import { CopySecretButton } from "@/components/common/CopySecretButton";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { Modal } from "@/components/common/Modal";
import { OAuthApplicationModel } from "@/core/model/oauth";
import { oauthApplicationService } from "@/core/service/oauth-applications-service";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface RegenerateSecretModalProps {
  application: OAuthApplicationModel;
  environment: APIEnvironment;
}

enum RegenerationStatus {
  AWAITING = "AWAITING",
  CONFIRMED = "CONFIRMED",
  REGENERATED = "REGENERATED",
  FAILED = "FAILED"
}

interface EventHandlingProps {
  clickHandler: () => void;
}

const RegenerateSecretConfirmationButton = ({ clickHandler }: EventHandlingProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3 w-full flex flex-col items-end">
      <button type="button"
              title={t("page-operations.secret.copy")}
              className={`border-danger-700 text-left inline-block rounded border-2 px-3 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={clickHandler}>
        <FontAwesomeIcon className="w-4 h-4" icon={faRefresh} /> {t("page-operations.oauth-application.regenerate-secret")}
      </button>
    </div>
  )
}

interface ViewSecretRegenerationResultProps {
  success: boolean;
  result: string;
}

const ViewSecretRegenerationResult = ({ success, result }: ViewSecretRegenerationResultProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      {success
        ? <p className="text-success-500">{t("modal.label.regenerate-secret.success")}</p>
        : <p className="text-danger-500">{t("modal.label.regenerate-secret.failed")}</p>
      }
      <p className="flex flex-row">
        <pre className="blockquote">{result}</pre>
        {success && <CopySecretButton value={result} />}
      </p>
    </>
  )
}

const SecretRegenerationWarning = ({ clickHandler }: EventHandlingProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <p className="text-danger-500 font-bold">{t("modal.label.regenerate-secret.question-continue")}</p>
      <p className="blockquote">{t("modal.label.regenerate-secret.operation-details")}</p>
      <p>
        <RegenerateSecretConfirmationButton clickHandler={clickHandler} />
      </p>
    </>
  )
}

/**
 * Modal window requesting confirmation to regenerate OAuth Client Secret of the application, and showing the new secret
 * on success.
 *
 * @param application OAuth application data
 * @param environment APIEnvironment object defining the target API configuration
 */
export const RegenerateSecretModal = ({ application, environment }: RegenerateSecretModalProps): ReactNode => {

  const { t } = useTranslation();
  const [status, setStatus] = useState(RegenerationStatus.AWAITING);
  const result = useRef<string>(undefined);
  const { regenerateApplicationSecret } = oauthApplicationService(environment);

  const handleSecretRegeneration = () => {

    setStatus(RegenerationStatus.CONFIRMED);
    regenerateApplicationSecret(application.id)
      .then(data => {
        result.current = data.clientSecret;
        setStatus(RegenerationStatus.REGENERATED);
      })
      .catch(reason => {
        result.current = reason?.message;
        setStatus(RegenerationStatus.FAILED);
      });
  }

  const resetModal = (): void => {

    result.current = undefined;
    setStatus(RegenerationStatus.AWAITING);
  }

  const screenStates = {
    [RegenerationStatus.AWAITING]: () => <SecretRegenerationWarning clickHandler={handleSecretRegeneration} />,
    [RegenerationStatus.CONFIRMED]: () => <InlineLoadingIndicator />,
    [RegenerationStatus.REGENERATED]: () => <ViewSecretRegenerationResult success={true} result={result.current!} />,
    [RegenerationStatus.FAILED]: () => <ViewSecretRegenerationResult success={false} result={result.current!} />
  };

  return (
    <Modal id={"regenerate-oauth-application-secret-modal"}
           title={t("modal.title.oauth-regenerate-secret", { application: application.name })}
           onClose={resetModal}>
      {screenStates[status]()}
    </Modal>
  );
}
