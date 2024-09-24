import { Separator } from "@/components/common/Separator";
import React, { ReactNode } from "react";

interface DataRowProps {
  children: ReactNode | ReactNode[];
  additionalClasses?: string;
}

interface DataCellProps {
  title?: string;
  children: string | ReactNode;
}

interface SizedDataCellProps extends DataCellProps {
  widthClass: "w-3/12" | "w-4/12" | "w-6/12" | "w-8/12" |"w-full";
}

/**
 * Renders a simple data row (items are aligned using flex-row directive). Also, adds a separator below the row.
 *
 * @param children contents to be rendered within
 * @param additionalClasses optional, additional class definitions
 */
export const DataRow = ({ children, additionalClasses }: DataRowProps): ReactNode => {

  return (
    <>
      <div className={`flex flex-row ${additionalClasses}`}>
        {children}
      </div>
      <Separator thick={false} />
    </>
  )
}

/**
 * Renders a simple data cell (a title if provided and below a value content).
 *
 * @param widthClass width class (see SizedDataCellProps)
 * @param title title of the data cell
 * @param children contents to be rendered within (string or another single React component)
 */
export const DataCell = ({ widthClass, title, children }: SizedDataCellProps): ReactNode => {

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
 * Renders a narrow (w-3/12) data cell (a title if provided and below a value content).
 *
 * @param title title of the data cell
 * @param children contents to be rendered within (string or another single React component)
 */
export const NarrowDataCell = ({ title, children }: DataCellProps): ReactNode => {
  return <DataCell widthClass={"w-3/12"} title={title} children={children} />
}

/**
 * Renders a 1/3-width (w-4/12) data cell (a title if provided and below a value content).
 *
 * @param title title of the data cell
 * @param children contents to be rendered within (string or another single React component)
 */
export const ThirdWidthDataCell = ({ title, children }: DataCellProps): ReactNode => {
  return <DataCell widthClass={"w-4/12"} title={title} children={children} />
}

/**
 * Renders a wide (w-6/12) data cell (a title if provided and below a value content).
 *
 * @param title title of the data cell
 * @param children contents to be rendered within (string or another single React component)
 */
export const WideDataCell = ({ title, children }: DataCellProps): ReactNode => {
  return <DataCell widthClass={"w-6/12"} title={title} children={children} />
}

/**
 * Renders a 2/3-width (w-8/12) data cell (a title if provided and below a value content).
 *
 * @param title title of the data cell
 * @param children contents to be rendered within (string or another single React component)
 */
export const TwoThirdWidthDataCell = ({ title, children }: DataCellProps): ReactNode => {
  return <DataCell widthClass={"w-8/12"} title={title} children={children} />
}

/**
 * Renders a full-width (w-full) data cell (a title if provided and below a value content).
 *
 * @param title title of the data cell
 * @param children contents to be rendered within (string or another single React component)
 */
export const FullWidthDataCell = ({ title, children }: DataCellProps): ReactNode => {
  return <DataCell widthClass={"w-full"} title={title} children={children} />
}
