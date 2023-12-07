import { ArticleCard } from "@/components/article/ArticleCard";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { ArticleModel, ArticleSearchResult } from "@/core/model/article";
import React, { ReactNode } from "react";

interface ArticleSearchResultListProps {
  data: ArticleSearchResult;
}

/**
 * Article list wrapper component for the article manager's list screen.
 *
 * @param data article info entries to be rendered
 */
export const ArticleSearchResultList = ({ data }: ArticleSearchResultListProps): ReactNode => {

  return (
    <ItemListPane pagination={data.pagination}>
      <ItemListHeader key={"article-search-header"}>
        <ItemListHeaderItem titleKey={"header.article-search.base"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.article-search.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.article-search.status"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.article-search.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody key={"article-search-body"} data={data.body.entries}>
        {(article: ArticleModel) => <ArticleCard key={`article-${article.id}`} article={article} />}
      </ItemListBody>
    </ItemListPane>
  )
}
