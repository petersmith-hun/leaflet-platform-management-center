import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ArticleComposerScreen } from "@/components/article/ArticleComposerScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { articleComposerFacade } from "@/core/facade/article-composer-facade";
import { swrKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * TODO.
 *
 * @constructor
 */
export default function CreateArticle(environment: APIEnvironment) {

  const { getCommonData } = articleComposerFacade(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { isLoading, data, error } = useSWR(swrKey("articles/compose", "global"), getCommonData);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.article.create"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ArticleComposerScreen environment={environment} commonData={data!} />}
    </SWRManagedScreen>
  )
}
