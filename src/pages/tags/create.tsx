import environmentProperties, { APIEnvironment } from "@/api-environment";
import { TagComposerScreen } from "@/components/tags/TagComposerScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Create article page.
 * Mapped to /articles/create
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function CreateTag(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.tag.create"));
  }, []);

  return <TagComposerScreen environment={environment} />
}
