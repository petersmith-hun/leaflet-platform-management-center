import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface SubmitButtonProps {
  label: string;
  icon: IconDefinition;
  awareness?: AwarenessLevel;
}

/**
 * Renders a form submit button styled by TW-Elements.
 *
 * @param label label of the button
 * @param icon icon of the button
 * @param awareness awareness indicator to be rendered on the button (see AwarenessLevel enum)
 */
export const SubmitButton = ({ label, icon, awareness = AwarenessLevel.NORMAL }: SubmitButtonProps): ReactNode => {

  return (
    <button type="submit"
            className={`${awareness} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 mb-3 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
      <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
    </button>
  )
}
