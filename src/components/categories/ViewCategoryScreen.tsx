import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { CategoryModel } from "@/core/model/category";
import categoryService from "@/core/service/category-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewCategoryScreenParameters {
  category: CategoryModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<CategoryModel>;
}

/**
 * Category viewer screen component. Renders a static page with all information of the given category.
 *
 * @param category data of an existing category
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewCategoryScreen = ({ category, environment, mutate }: ViewCategoryScreenParameters): ReactNode => {

  const { changeGeneralStatus, deleteCategoryByID } = categoryService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={category.title}>
          <DataRow>
            <WideDataCell title={t("forms:category.edit.title")} children={category.title} />
            <NarrowDataCell title={t("forms:category.edit.general-status")}>
              <ItemEnabledStatusFlag item={category} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:category.edit.description")}>
              <p className="blockquote text-neutral-300">{category.description}</p>
            </FullWidthDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:category.edit.created-at")}
                          children={dateFormatter(category.created)} />
            <NarrowDataCell title={t("forms:category.edit.last-modified-at")}
                            children={dateFormatter(category.lastModified) ?? t("category.label.never-modified")} />
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.category")}>
          <PageOperationButton label={t("page-operations.category.edit")} icon={faPencil}
                               link={`/categories/edit/${category.id}`} />
          <PageOperationButton label={t("page-operations.category.back-to-categories")} icon={faList}
                               link={"/categories"} />
          <GeneralStatusUpdateOperation domain={"category"} entity={category} titleSupplier={category => category.title}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <DeleteOperation domain={"category"} entity={category} titleSupplier={category => category.title}
                           serviceCall={deleteCategoryByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
