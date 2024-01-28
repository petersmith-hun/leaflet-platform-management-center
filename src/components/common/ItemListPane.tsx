import { Paginator } from "@/components/common/Paginator";
import { WidePane } from "@/components/common/ScreenLayout";
import { noOpPagination, Pagination } from "@/core/model/common";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ChildrenListProps {
  children: ReactNode[];
  title?: string;
}

interface ItemListProps extends ChildrenListProps {
  pagination?: Pagination;
}

interface ItemListHeaderItemProps {
  titleKey: string;
  widthClass: "w-1/12" | "w-2/12" | "w-3/12" | "w-4/12" | "w-5/12" | "w-8/12";
}

interface ItemListBodyProps<T> {
  data: T[];
  children: (item: T) => ReactNode;
}

/**
 * Renders a header above the item list.
 *
 * @param children contents to be rendered within
 * @param title optional header title
 */
export const ItemListHeader = ({ children, title }: ChildrenListProps): ReactNode => {

  return (
    <div
      className="rounded-lg bg-white p-2 mb-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-lg dark:bg-neutral-700 md:flex flex-col text-center text-xs text-neutral-400 hidden">
      {title && <p className="pl-2 text-left text-lg text-neutral-50">{title}</p>}
      <div className="md:flex flex-row">
        {children}
      </div>
    </div>
  )
}

/**
 * Renders a header item within the item list header.
 *
 * @param titleKey translation key of the header item title
 * @param widthClass supported width classes for the header item
 */
export const ItemListHeaderItem = ({ titleKey, widthClass }: ItemListHeaderItemProps): ReactNode => {

  const { t } = useTranslation();

  return <div className={widthClass}>{t(titleKey)}</div>
}

/**
 * Renders the item list based on the provided data list, and the item supplier function.
 *
 * @param data list of items to be rendered within
 * @param children contents to be rendered within
 */
export const ItemListBody = ({ data, children }: ItemListBodyProps<any>): ReactNode => {

  return (
    <div>
      {data.map(item => children(item))}
    </div>
  )
}

/**
 * Renders a WidePane component including pagination if the required data is provided.
 *
 * @param children contents to be rendered within
 * @param pagination Pagination object containing pagination information
 */
export const ItemListPane = ({ children, pagination }: ItemListProps): ReactNode => {

  return (
    <WidePane>
      {children}
      {pagination && pagination != noOpPagination && (
        <nav aria-label="Page navigation example">
          <ul className="list-style-none flex">
            <Paginator pagination={pagination} />
          </ul>
        </nav>
      )}
    </WidePane>
  )
}
