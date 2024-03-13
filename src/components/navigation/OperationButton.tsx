import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

/**
 * Supported awareness levels for buttons.
 */
export enum AwarenessLevel {

  /**
   * Adds a blue border.
   */
  NORMAL = "border-primary-100",

  /**
   * Adds a green border.
   */
  POSITIVE = "border-success",

  /**
   * Adds a yellow border.
   */
  WARNING = "border-warning",

  /**
   * Adds a red border.
   */
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
  popconfirmDomain?: string;
  icon: IconDefinition;
  id: string,
  awareness?: AwarenessLevel;
  onSubmit: () => void;
}

/**
 * Renders an operation button. Can be used anywhere.
 *
 * @param label label of the operation button
 * @param icon icon of the operation button as FontAwesome IconDefinition
 * @param link link of the operation button
 * @param additionalClass additional classes to be attached to the button
 * @param awareness awareness level of the button
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
 * Renders a page operation button. Should be used within page operation blocks.
 *
 * @param label label of the operation button
 * @param icon icon of the operation button as FontAwesome IconDefinition
 * @param link link of the operation button
 * @param awareness awareness level of the button
 */
export const PageOperationButton = ({ label, icon, link, awareness = AwarenessLevel.NORMAL }: PageOperationButtonProperties): ReactNode => {
  return <OperationButton label={label} icon={icon} link={link} additionalClass="mb-3" awareness={awareness} />
}

/**
 * Renders a confirmed operation button. Instead of simply linking to a different page, these buttons used a form and a popover notification.
 *
 * @param label label of the operation button
 * @param popconfirmDomain entity domain of the Popconfirm dialog
 * @param icon icon of the operation button as FontAwesome IconDefinition
 * @param id ID of the button, used to attach it to the popconfirm
 * @param onSubmit submit handler function
 * @param awareness awareness level of the button
 */
export const ConfirmedOperationButton = ({ label, popconfirmDomain = "article", icon, id, onSubmit, awareness = AwarenessLevel.NORMAL }: ConfirmedOperationButtonProperties): ReactNode => {

  const { t } = useTranslation("forms");
  const { handleSubmit } = useForm<never>();

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Popconfirm]));
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
              data-te-message={t(`confirmation.delete.${popconfirmDomain}`)}
              data-te-class-message-text="text-warning dark:text-white"
              data-te-class-body="p-[1rem] bg-dark rounded-[0.5rem] opacity-0 dark:bg-neutral-700"
              className={`${awareness} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 mb-3 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
      </button>
    </form>
  )
}
