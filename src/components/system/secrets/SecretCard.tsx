import { APIEnvironment } from "@/api-environment";
import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { SecretRetrievalError } from "@/components/system/secrets/SecretModal";
import { SecretMetadataModel } from "@/core/model/secrets";
import { secretService } from "@/core/service/secret-service";
import { faAsterisk, faCalendar, faEdit, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import Link from "next/link";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface SecretCardProps {
  environment: APIEnvironment;
  secret: SecretMetadataModel;
  setSecretModalTitle: Dispatch<SetStateAction<string>>;
  setSecretModalValue: Dispatch<SetStateAction<ReactNode | string | null>>;
}

/**
 * Renders a card in the Domino Secret Manager list displaying the summary of a secret.
 *
 * @param deployment Domino deployment definition
 */
export const SecretCard = ({ environment, secret, setSecretModalTitle, setSecretModalValue }: SecretCardProps): ReactNode => {

  const { getSecret } = secretService(environment);
  const { t } = useTranslation();

  const handleShowSecret = (key: string) => {

    setSecretModalTitle(key);

    getSecret(key)
      .then(value => setSecretModalValue(value[key]))
      .catch((axiosError: AxiosError) => setSecretModalValue(<SecretRetrievalError axiosError={axiosError} />));
  }

  return (
    <ItemListCard>
      <div className="w-4/12">
        <h5 className="mb-2 text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/system/secrets/view/${secret.key}`} className="text-primary-400 hover:text-primary-200">
            {secret.key}
          </Link>
        </h5>
        <Separator thick={false} />
        {secret.retrievable && (
          <button type="button"
                  data-te-toggle="modal"
                  data-te-target="#secret-modal"
                  onClick={() => handleShowSecret(secret.key)}
                  className="h-8 mr-2 rounded border-2 px-2 py-1 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10">
            <FontAwesomeIcon className="w-3" icon={faEye} /> {t("system.secrets.label.show-secret")}
          </button>
        )}
        {!secret.retrievable && (
          <span className="text-danger">
            <FontAwesomeIcon className="w-4" icon={faLock} /> {t("system.secrets.label.non-retrievable")}
          </span>
        )}
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={secret.createdAt} icon={faEdit} />
        <FormattedArticleDate date={secret.updatedAt} icon={faAsterisk} />
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        {secret.lastAccessedBy ? (
          <>
            <p>
              <FontAwesomeIcon className="w-4" icon={faEye} /> {secret.lastAccessedBy}
            </p>
            <FormattedArticleDate date={secret.lastAccessedAt} icon={faCalendar} />
          </>
        ) : (
          <p>
            <FontAwesomeIcon className="w-4" icon={faEye} /> {t("system.secrets.label.never-accessed")}
          </p>
        )}
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`secret-${secret.key}`}>
          <ViewDropdownMenuItem link={`/system/secrets/view/${secret.key}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
