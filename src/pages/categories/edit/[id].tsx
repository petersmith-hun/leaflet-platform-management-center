import environmentProperties, { APIEnvironment } from "@/api-environment";
import { CategoryComposerScreen } from "@/components/categories/CategoryComposerScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import categoryService from "@/core/service/category-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Edit category page.
 * Mapped to /categories/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditCategory(environment: APIEnvironment) {

  const { getCategoryByID } = categoryService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("categories/edit", router.query.id), (key) => getCategoryByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.category.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <CategoryComposerScreen environment={environment} category={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
