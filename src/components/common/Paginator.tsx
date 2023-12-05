import { SimpleCard } from "@/components/common/Cards";
import { createQueryString } from "@/components/utility/query-string-util";
import { Pagination } from "@/core/model/common";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface PageButtonProps {
  index: number;
  queryString: string;
  label?: string;
}

interface PaginatorProps {
  pagination: Pagination;
}

const PageButton = ({ index, queryString, label }: PageButtonProps): ReactNode => {

  return (
    <li>
      <Link
        className="relative block rounded bg-transparent px-3 py-1.5 mx-1 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 dark:hover:text-white dark:bg-neutral-600"
        href={`?page=${index}${queryString ? "&" + queryString : ""}`}>
        {label ? label : index}
      </Link>
    </li>
  );
}

/**
 * Renders a TW-Elements Pagination component.
 *
 * @param pagination pagination properties (page number, page size, ordering, etc.)
 */
export const Paginator = ({ pagination }: PaginatorProps): ReactNode => {

  const { t } = useTranslation();
  const { query } = useRouter();
  const queryString = createQueryString(query as Record<string, string>);

  let pageButtons: ReactNode[] = [];
  if (pagination.hasPrevious) {
    pageButtons.push(<PageButton key="page-previous" index={pagination.pageNumber - 1} queryString={queryString}
                                 label={t("pagination.page-previous")} />)
  }

  for (let index = 1; index <= (pagination.pageCount ?? 1); index++) {
    pageButtons.push(
      <PageButton key={`page-${index}`} index={index} queryString={queryString} />
    )
  }

  if (pagination.hasNext) {
    pageButtons.push(<PageButton key="page-next" index={pagination.pageNumber + 1} queryString={queryString}
                                 label={t("pagination.page-next")} />)
  }

  return (
    <SimpleCard>
      <nav aria-label="Navigation">
        <ul className="list-style-none flex justify-center">
          {pageButtons}
        </ul>
      </nav>
    </SimpleCard>
  )
}
