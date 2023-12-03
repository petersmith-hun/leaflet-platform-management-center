import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ArticleComposerScreen } from "@/components/article/ArticleComposerScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { articleComposerFacade } from "@/core/facade/article-composer-facade";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * TODO.
 * @param environment
 */
export default function EditArticle(environment: APIEnvironment) {

  const { getCommonData } = articleComposerFacade(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error
  } = useSWR(swrNumberKey("articles/edit", router.query.id), (key) => getCommonData(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.article.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ArticleComposerScreen environment={environment} commonData={data!} />}
    </SWRManagedScreen>
  )
}
