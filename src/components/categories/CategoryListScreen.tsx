import { ScreenParameters } from "@/api-environment";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { CategoryModel } from "@/core/model/category";
import { noOpPagination } from "@/core/model/common";
import categoryService from "@/core/service/category-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface CategoryListResultProps {
  categories: CategoryModel[];
}

const CategoryListResult = ({ categories }: CategoryListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={noOpPagination}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.category.title"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.category.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.category.status"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.category.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={categories}>
        {(category: CategoryModel) => <CategoryCard key={`category-${category.id}`} category={category} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of category manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const CategoryListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllCategories } = categoryService(environment);
  const { isLoading, data, error } = useSWR(swrNumberKey("categories", "all"), getAllCategories);

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <CategoryListResult categories={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.category")}>
          <PageOperationButton label={t("page-operations.category.new")} icon={faEdit} link="/categories/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
