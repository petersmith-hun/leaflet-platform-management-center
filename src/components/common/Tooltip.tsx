import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface TooltipProps {
  tooltipKey: string;
}

/**
 * Renders a tooltip with the given content (translatable key should be passed).
 *
 * @param tooltipKey translatable key of the content to be shown
 */
export const Tooltip = ({ tooltipKey }: TooltipProps): ReactNode => {

  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <span
      className="transititext-primary text-neutral transition duration-150 ease-in-out hover:text-neutral-600 focus:text-neutral-600 active:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:active:text-neutral-600"
      data-te-toggle="tooltip"
      title={t(tooltipKey)}>
      <FontAwesomeIcon icon={faCircleInfo} />
    </span>
  )
}
