import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ViewArticleScreen } from "@/components/article/ViewArticleScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import articleService from "@/core/service/article-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { useRouter } from "next/router";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * TODO.
 * @param environment
 */
export default function ViewArticle(environment: APIEnvironment) {

  const { getArticleByID } = articleService(environment);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrNumberKey("article/view", router.query.id), key => getArticleByID(key.parameter));

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewArticleScreen article={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
