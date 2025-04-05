import {
  AutoSavedMessageProps,
  AutoSavePausedMessageProps,
  ButtonClickHandlerProps
} from "@/components/form/autosaved/index";
import { faCheckCircle, faExclamationCircle, faRedo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

const lastSavedTimeFormat = "HH:mm:ss";

const DropButton = ({ onClick }: ButtonClickHandlerProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <button type="button"
            onClick={onClick}
            className={`border-danger text-left inline-block rounded border-2 px-6 pb-[2px] pt-1 ml-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-normal-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
      <FontAwesomeIcon className="w-3 h-3 mr-2" icon={faTrash} /> {t("auto-saved.button.drop")}
    </button>
  )
}

const RestoreButton = ({ onClick }: ButtonClickHandlerProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <button type="button"
            onClick={onClick}
            className={`border-warning text-left inline-block rounded border-2 px-6 pb-[2px] pt-1 ml-2 text-xs font-medium uppercase leading-normal text-normal-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-normal-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
      <FontAwesomeIcon className="w-3 h-3 mr-2" icon={faRedo} /> {t("auto-saved.button.restore")}
    </button>
  )
}

/**
 * Renders an "auto-saved" or "restored" message banner, depending on the given auto-save status.
 *
 * @param status auto-save status of the content
 * @param lastSaved optional time when the content was last saved
 */
export const AutoSavedMessage = ({ restored, lastSaved }: AutoSavedMessageProps): ReactNode => {

  const { t } = useTranslation();

  const lastSavedFormatted = lastSaved?.toFormat(lastSavedTimeFormat) ?? t("auto-saved.label.never-saved");
  const message = restored
    ? t("auto-saved.label.restored", { lastSaved: lastSavedFormatted })
    : t("auto-saved.label.saved", { lastSaved: lastSavedFormatted });

  return (
    <>
      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
      <span>{message}</span>
    </>
  )
}

/**
 * Renders an "auto-save paused" message banner, including the time when the content was last auto-saved (if ever, otherwise shows "never saved").
 *
 * @param onRestore handler function reference for the "restore" button
 * @param onDrop handler function reference for the "drop stored version" button
 * @param lastSaved optional time when the content was last saved
 */
export const AutoSavePausedMessage = ({ onRestore, onDrop, lastSaved }: AutoSavePausedMessageProps): ReactNode => {

  const { t } = useTranslation();

  const lastSavedFormatted = lastSaved?.toFormat(lastSavedTimeFormat) ?? t("auto-saved.label.never-saved");

  return (
    <>
      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
      <span>
        {t("auto-saved.label.paused", { lastSaved: lastSavedFormatted })}
        <RestoreButton onClick={onRestore} />
        <DropButton onClick={onDrop} />
      </span>
    </>
  )
}
