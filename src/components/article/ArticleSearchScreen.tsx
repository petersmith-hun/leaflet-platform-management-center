import { APIEnvironment } from "@/api-environment";
import { ArticleSearchForm } from "@/components/article/ArticleSearchForm";
import { ArticleSearchResultList } from "@/components/article/ArticleSearchResultList";
import { CardWithTitle } from "@/components/common/Cards";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import articleService from "@/core/service/article-service";
import { faEdit, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

/**
 * TODO.
 *
 * @param data
 * @constructor
 */
export const ArticleSearchScreen = ({ environment }: { environment: APIEnvironment }): ReactNode => {

  const { searchArticles } = articleService(environment);
  const { t } = useTranslation();
  const { query } = useRouter();
  const { isLoading, data, error } = useSWR({ type: "article-search", parameters: query }, _ => searchArticles(query));

  return (
    <div className="flex flex-row justify-between">
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <ArticleSearchResultList data={data!} />}
      </SWRManagedScreen>
      <div className="w-3/12 ml-3">
        <CardWithTitle title={t("page-operations.article")}>
          <div className="flex flex-col">
            <PageOperationButton label={t("page-operations.article.new")} icon={faEdit} link="/articles/create" />
            <PageOperationButton label={t("page-operations.article.show-all")} icon={faList} link="/articles" />
          </div>
        </CardWithTitle>
        <CardWithTitle title={t("page-operations.article.search")}>
          <ArticleSearchForm />
        </CardWithTitle>
      </div>
    </div>
  )
}
