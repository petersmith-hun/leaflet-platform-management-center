import { ScreenParameters } from "@/api-environment";
import { ArticleSearchForm } from "@/components/article/ArticleSearchForm";
import { ArticleSearchResultList } from "@/components/article/ArticleSearchResultList";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import articleService from "@/core/service/article-service";
import { swrKey } from "@/core/util/swr-key";
import { faEdit, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

/**
 * Main screen of the artile manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const ArticleSearchScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { searchArticles } = articleService(environment);
  const { t } = useTranslation();
  const { query } = useRouter();
  const { isLoading, data, error } = useSWR(swrKey("article/search", query), _ => searchArticles(query));

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <ArticleSearchResultList data={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.article")}>
          <PageOperationButton label={t("page-operations.article.new")} icon={faEdit} link="/articles/create" />
          <PageOperationButton label={t("page-operations.article.show-all")} icon={faList} link="/articles" />
        </PageOperationCard>
        <CardWithTitle title={t("page-operations.article.search")}>
          <ArticleSearchForm />
        </CardWithTitle>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
