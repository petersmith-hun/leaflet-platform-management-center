import environmentProperties, { APIEnvironment } from "@/api-environment";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import articleService from "@/core/service/article-service";
import { PageContext } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * TODO.
 *
 * @constructor
 */
export default function Articles(environment: APIEnvironment) {

  const { searchArticles } = articleService(environment);
  const { query } = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { isLoading, data, error } = useSWR({ type: "article-search", parameters: query }, _ => searchArticles(query));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.articles"));
  }, []);

  if (isLoading) {
    return <InlineLoadingIndicator />;
  }

  if (error) {
    return (
      <div className="mb-4 rounded-lg bg-warning-100 px-6 py-5 text-base text-warning-800" role="alert">
        Not found
      </div>
    )
  }

  let pagination = [];
  for (let index = 1; index <= (data?.pagination.pageCount ?? 1); index++) {
    pagination.push(
      <li key={`page-${index}`}>
        <Link className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              href={`?page=${index}`}>{index}</Link>
      </li>
    )
  }

  let articles = data?.body.entries.map(article => <li key={`article-${article.id}`}>{article.title}</li>);

  return (
    <div>
      <ul>
        {articles}
      </ul>

      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex">
          {pagination}
        </ul>
      </nav>
    </div>
  )
}
