import environmentProperties, { APIEnvironment } from "@/api-environment";
import { CategoryListScreen } from "@/components/categories/CategoryListScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Category manager main page.
 * Mapped to /categories
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Categories(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.categories"));
  }, []);

  return <CategoryListScreen environment={environment} />
}
