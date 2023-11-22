import React, { ReactNode, useEffect } from "react";

/**
 * Shows a loading indicator.
 */
export const LoadingIndicator = (): ReactNode => {

  useEffect(() => {
    const init = async () => {
      const { LoadingManagement, initTE } = await import("tw-elements");
      initTE({ LoadingManagement });
    };
    init();
  }, []);

  return (
    <main className="dark min-h-screen h-full w-full">
      <div data-te-loading-management-init="">
        <div data-te-loading-icon-ref=""
             className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
             role="status">
        </div>
        <span data-te-loading-text-ref="">Loading...</span>
      </div>
    </main>
  )
}
