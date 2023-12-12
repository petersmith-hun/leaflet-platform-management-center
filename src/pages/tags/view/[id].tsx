import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewTagScreen } from "@/components/tags/ViewTagScreen";
import tagService from "@/core/service/tag-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View tag page.
 * Mapped to /tags/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewTag(environment: APIEnvironment) {

  const { getTagByID } = tagService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrNumberKey("tags/view", router.query.id), key => getTagByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.tag.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewTagScreen tag={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
