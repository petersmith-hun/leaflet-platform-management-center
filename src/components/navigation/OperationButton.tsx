import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

/**
 * TODO.
 */
export enum AwarenessLevel {
  NORMAL = "border-primary-100",
  POSITIVE = "border-success",
  WARNING = "border-warning",
  ALERT = "border-danger"
}

interface PageOperationButtonProperties {
  label: string;
  icon: IconDefinition;
  link: string;
  awareness?: AwarenessLevel;
}

interface OperationButtonProperties extends PageOperationButtonProperties {
  additionalClass?: string;
}

interface ConfirmedOperationButtonProperties {
  label: string;
  icon: IconDefinition;
  id: string,
  awareness?: AwarenessLevel;
  onSubmit: () => void;
}

/**
 * TODO.
 * @param label
 * @param icon
 * @param link
 * @param additionalClass
 * @param awareness
 */
export const OperationButton = ({ label, icon, link, additionalClass = "mr-2", awareness = AwarenessLevel.NORMAL }: OperationButtonProperties): ReactNode => {

  return (
    <Link href={link} className={additionalClass}>
      <button type="button"
              className={`${awareness} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
      </button>
    </Link>
  )
}

/**
 * TODO.
 *
 * @param label
 * @param icon
 * @param link
 * @param awareness
 */
export const PageOperationButton = ({ label, icon, link, awareness = AwarenessLevel.NORMAL }: PageOperationButtonProperties): ReactNode => {
  return <OperationButton label={label} icon={icon} link={link} additionalClass="mb-3" awareness={awareness} />
}

/**
 * TODO.
 *
 * @param label
 * @param icon
 * @param link
 * @param onSubmit
 * @param awareness
 */
export const ConfirmedOperationButton = ({ label, icon, id, onSubmit, awareness = AwarenessLevel.NORMAL }: ConfirmedOperationButtonProperties): ReactNode => {

  const { t } = useTranslation("forms");
  const { handleSubmit } = useForm<never>();

  useEffect(() => {
    const init = async () => {
      const { Popconfirm, initTE } = await import("tw-elements");
      initTE({ Popconfirm }, { allowReinits: true });
    };
    init();
  }, []);

  const popConfirmID = `popConfirm-${id}`;
  const confirmedSubmitHandler = () => {
    return document.getElementById(popConfirmID)?.addEventListener("confirm.te.popconfirm", onSubmit);
  };

  return (
    <form onSubmit={handleSubmit(confirmedSubmitHandler)}>
      <button type="submit"
              id={popConfirmID}
              data-te-toggle="popconfirm"
              data-te-ripple-color="dark"
              data-te-cancel-text={t("confirmation.cancel")}
              data-te-message={t("confirmation.delete.article")}
              data-te-class-message-text="text-warning dark:text-white"
              data-te-class-body="p-[1rem] bg-dark rounded-[0.5rem] opacity-0 dark:bg-neutral-700"
              className={`${awareness} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 mb-3 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
      </button>
    </form>
  )
}
