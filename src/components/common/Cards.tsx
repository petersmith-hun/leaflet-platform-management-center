import { ResizeBlockButton } from "@/components/common/ResizeBlockButton";
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
 * @param resizable
 */
export const CardWithTitle = ({ children, title, resizable }: { children: ReactNode, title: string, resizable?: string }) => {

  return (
    <SimpleCard>
      <h2 className="mb-2 mt-0 text-xl font-medium leading-tight text-primary-200 clear-both">
        {title}
        {resizable && <ResizeBlockButton resizableContainerID={resizable} />}
      </h2>
      <Separator thick={false} />
      {children}
    </SimpleCard>
  )
}

/**
 * TODO.
 *
 * @param children
 * @param title
 * @constructor
 */
export const PageOperationCard = ({ children, title }: { children: ReactNode, title: string }) => {

  return (
    <CardWithTitle title={title}>
      <div className="flex flex-col">
        {children}
      </div>
    </CardWithTitle>
  )
}
