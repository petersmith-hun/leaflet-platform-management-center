import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

interface CopySecretButtonProps {
  value: string;
}

/**
 * Button to copy the attached secret value to the clipboard.
 *
 * @param value value to be copied to the clipboard
 */
export const CopySecretButton = ({ value }: CopySecretButtonProps): ReactNode => {

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
