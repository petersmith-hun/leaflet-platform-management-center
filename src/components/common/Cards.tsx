import { Separator } from "@/components/common/Separator";
import React, { ReactNode } from "react";

/**
 * TODO.
 * @param children
 */
export const SimpleCard = ({ children }: { children: ReactNode }) => {

  return (
    <div
      className="block w-full mb-3 rounded-lg bg-white text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

/**
 * TODO.
 *
 * @param children
 * @param title
 */
export const CardWithTitle = ({ children, title }: { children: ReactNode, title: string }) => {

  return (
    <SimpleCard>
      <h2>{title}</h2>
      <Separator thick={false} />
      {children}
    </SimpleCard>
  )
}
