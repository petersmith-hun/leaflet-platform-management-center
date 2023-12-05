import { faArrowsH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";

const widthClasses = ["max-w-md", "max-w-4xl", "max-w-7xl"];

interface ResizeBlockButtonProps {
  resizableContainerID: string;
}

/**
 * Renders a resize block button. On click, cycles through the available maximum width classes ("max-w-md", "max-w-4xl" and "max-w-7xl").
 *
 * @param resizableContainerID ID of the resizable container to attach this button to
 */
export const ResizeBlockButton = ({ resizableContainerID }: ResizeBlockButtonProps): ReactElement => {

  let currentWidth = 2;

  const switchContentWidth = (resizableElementID?: string): void => {

    stepCurrentWidth();
    const resizableDiv = document.querySelector(`#${resizableElementID}`);
    const className = widthClasses[currentWidth];

    resizableDiv?.removeAttribute("class");
    resizableDiv?.setAttribute("class", className);
  }

  const stepCurrentWidth = (): void => {

    currentWidth = currentWidth === 2
      ? 0
      : currentWidth + 1;
  }

  return (
    <button type="button" className="float-right rounded border-2 px-2 py-1 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10"
            onClick={() => switchContentWidth(resizableContainerID)}>
      <FontAwesomeIcon icon={faArrowsH} />
    </button>
  )
}
