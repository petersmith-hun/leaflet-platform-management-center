import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ViewCategoryScreen } from "@/components/categories/ViewCategoryScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import categoryService from "@/core/service/category-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View category page.
 * Mapped to /categories/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewCategory(environment: APIEnvironment) {

  const { getCategoryByID } = categoryService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrNumberKey("categories/view", router.query.id), key => getCategoryByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.category.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewCategoryScreen category={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
