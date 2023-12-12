import environmentProperties, { APIEnvironment } from "@/api-environment";
import { TagListScreen } from "@/components/tags/TagListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Tag manager main page.
 * Mapped to /tags
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Tags(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.tags"));
  }, []);

  return <TagListScreen environment={environment} />
}
