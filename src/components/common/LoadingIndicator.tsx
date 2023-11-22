import { LeafletLogo } from "@/components/common/LeafletLogo";
import React, { ReactNode } from "react";

/**
 * Shows a loading indicator.
 */
export const LoadingIndicator = (): ReactNode => {

  return (
    <main className="dark min-h-screen h-full w-full align-middle text-center mt-12 pt-12">
      <LeafletLogo big={true} />
      <hr
        className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      <div
        className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
      <br />
      <span className="text-primary">Loading ...</span>
    </main>
  )
}
