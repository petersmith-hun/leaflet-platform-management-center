import environmentProperties, { APIEnvironment } from "@/api-environment";
import { CategoryComposerScreen } from "@/components/categories/CategoryComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create category page.
 * Mapped to /categories/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateCategory(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.category.create"));
  }, []);

  return <CategoryComposerScreen environment={environment} />
}
