import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import React, { MouseEventHandler, ReactNode, useEffect } from "react";

interface ModalProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose?: MouseEventHandler;
}

interface CloseButtonProps {
  onClose?: MouseEventHandler;
}

const CloseButton = ({ onClose }: CloseButtonProps): ReactNode => {
  return (
    <button
      type="button"
      className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
      data-te-modal-dismiss=""
      onClick={onClose}
      aria-label="Close">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-6 w-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

/**
 * Renders a TW-Elements Modal component.
 *
 * @param id ID of the modal window
 * @param title title of the modal window
 * @param children contents to be rendered within
 * @param onClose additional logic to be executed on close (optional)
 */
export const Modal = ({ id, title, children, onClose }: ModalProps) => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Modal]));
  }, []);

  return (
    <div
      data-te-modal-init=""
      className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
      id={id}
      tabIndex={-1}
      aria-labelledby={id}
      aria-modal="true"
      role="dialog">
      <div
        data-te-modal-dialog-ref=""
        className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] min-[992px]:max-w-[800px] min-[1200px]:max-w-[1140px]">
        <div
          className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
          <div
            className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
            <h5
              className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
              id={`${id}-title`}>
              {title}
            </h5>
            <CloseButton onClose={onClose} />
          </div>

          <div className="relative p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
