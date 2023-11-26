import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

/**
 * TODO.
 *
 * @param label
 * @param icon
 * @param link
 */
export const SubmitButton = ({ label, icon }: { label: string, icon: IconDefinition }): ReactNode => {

  return (
    <button type="submit"
            className="text-left inline-block w-full rounded border-2 border-primary-100 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10">
      <FontAwesomeIcon icon={icon} /> {label}
    </button>
  )
}
