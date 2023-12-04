import { Separator } from "@/components/common/Separator";
import React, { ReactNode } from "react";

/**
 * TODO.
 *
 * @param children
 */
export const DataRow = ({ children }: { children: ReactNode | ReactNode[] }): ReactNode => {

  return (
    <>
      <div className="flex flex-row">
        {children}
      </div>
      <Separator thick={false} />
    </>
  )
}

/**
 * TODO.
 *
 * @param widthClass
 * @param title
 * @param children
 */
export const DataCell = ({ widthClass, title, children }: {
  widthClass: "w-3/12" | "w-6/12" | "w-full",
  title?: string,
  children: string | ReactNode
}): ReactNode => {

  return (
    <div className={widthClass}>
      {title && (
        <>
          <b>{title}</b>
          <br />
        </>
      )}
      {children}
    </div>
  );
}

/**
 * TODO.
 *
 * @param title
 * @param children
 */
export const NarrowDataCell = ({ title, children }: { title?: string, children: string | ReactNode }): ReactNode => {
  return <DataCell widthClass={"w-3/12"} title={title} children={children} />
}

/**
 * TODO.
 *
 * @param title
 * @param children
 */
export const WideDataCell = ({ title, children }: { title?: string, children: string | ReactNode }): ReactNode => {
  return <DataCell widthClass={"w-6/12"} title={title} children={children} />
}

/**
 * TODO.
 *
 * @param title
 * @param children
 */
export const FullWidthDataCell = ({ title, children }: { title?: string, children: string | ReactNode }): ReactNode => {
  return <DataCell widthClass={"w-full"} title={title} children={children} />
}
