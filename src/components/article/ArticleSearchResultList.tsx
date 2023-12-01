import { ArticleCard } from "@/components/article/ArticleCard";
import { Paginator } from "@/components/common/Paginator";
import { WidePane } from "@/components/common/ScreenLayout";
import { ArticleSearchResult } from "@/core/model/article";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const ArticleSearchResultList = ({ data }: { data: ArticleSearchResult }): ReactNode => {

  const { t } = useTranslation();

  return (
    <WidePane>
      <div
        className="rounded-lg bg-white p-2 mb-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-lg dark:bg-neutral-700 md:flex flex-row text-center text-xs text-neutral-400 hidden">
        <div className="w-5/12">{t("header.article-search.base")}</div>
        <div className="w-3/12">{t("header.article-search.dates")}</div>
        <div className="w-2/12">{t("header.article-search.status")}</div>
        <div className="w-2/12">{t("header.article-search.operations")}</div>
      </div>
      <div>
        {data?.body.entries
          .map(article => <ArticleCard key={`article-${article.id}`} {...article} />)}
      </div>
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex">
          <Paginator {...data!.pagination} />
        </ul>
      </nav>
    </WidePane>
  )
}
