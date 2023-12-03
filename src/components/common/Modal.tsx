import React, { ReactNode } from "react";

const CloseButton = (): ReactNode => {
  return (
    <button
      type="button"
      className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
      data-te-modal-dismiss=""
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
 * TODO.
 *
 * @param id
 * @param title
 * @param children
 */
export const Modal = ({ id, title, children }: { id: string, title: string, children: ReactNode }) => {

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
            <CloseButton />
          </div>

          <div className="relative p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
