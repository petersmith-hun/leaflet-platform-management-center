import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { CategoryEditRequest, CategoryModel } from "@/core/model/category";
import categoryService from "@/core/service/category-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface CategoryComposerScreenProps {
  environment: APIEnvironment;
  category?: CategoryModel;
  mutate?: KeyedMutator<CategoryModel>;
}

/**
 * Screen used by category manager's create/edit operations. For editing purpose, provide the category itself, as well
 * as an SWR mutate function to invalidate the cache for the edited category.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param category category data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const CategoryComposerScreen = ({ environment, category, mutate }: CategoryComposerScreenProps): ReactNode => {

  const { createCategory, editCategory } = categoryService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryEditRequest>({
    defaultValues: category
  });
  const router = useRouter();
  const categoryID = router.query.id as number | undefined;

  useEffect(() => {
    const init = async () => {
      const { Input, initTE } = await import("tw-elements");
      initTE({ Input }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <SubmitOperation domain={"category"} mutate={mutate} titleSupplier={category => category.title}
                     handleSubmit={handleSubmit}
                     serviceCall={entity => categoryID
                       ? editCategory(categoryID, entity)
                       : createCategory(entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={category?.title ?? t("page.title.category.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("title", { required: t("forms:validation.common.required") })}
                       label={t("forms:category.edit.title")} id={"category-name"}
                       errorSupplier={() => errors.title?.message} />
              </WideDataCell>
              <WideDataCell>
                <Textarea registerReturn={register("description", { required: t("forms:validation.common.required") })}
                          label={t("forms:category.edit.description")} id={"category-description"}
                          errorSupplier={() => errors.description?.message} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.category")}>
            <PageOperationButton label={t("page-operations.category.back-to-categories")} icon={faList}
                                 link={"/categories"} />
            {categoryID && <PageOperationButton label={t("page-operations.category.view")} icon={faEye}
                                                link={`/categories/view/${categoryID}`} />}
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
