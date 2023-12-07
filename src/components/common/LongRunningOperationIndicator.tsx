import { PageContext } from "@/pages/_app";
import React, { ReactNode, useContext } from "react";

/**
 * Displays a loading indicator when the application is waiting for an operation (REST request) to finish.
 */
export const LongRunningOperationIndicator = (): ReactNode => {

  const { operationInProgress } = useContext(PageContext);

  if (!operationInProgress) {
    return null;
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none none block pt-[300px]">
        <div className="p-6 text-center">
          <div
            className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-primary"
            role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      </div>
      <div className="transition-all duration-300 ease-in-out fixed top-0 left-0 z-[1040] bg-black w-screen h-screen opacity-50" data-te-backdrop-show=""></div>
    </>
  )
}
