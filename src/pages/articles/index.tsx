import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ArticleSearchScreen } from "@/components/article/ArticleSearchScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Article manager main page.
 * Mapped to /articles
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Articles(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.articles"));
  }, []);

  return (
    <ArticleSearchScreen environment={environment} />
  )
}
