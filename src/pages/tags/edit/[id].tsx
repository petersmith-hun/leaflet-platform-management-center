import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { TagComposerScreen } from "@/components/tags/TagComposerScreen";
import tagService from "@/core/service/tag-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Edit tag page.
 * Mapped to /tags/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditTag(environment: APIEnvironment) {

  const { getTagByID } = tagService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("tags/edit", router.query.id), (key) => getTagByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.tag.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <TagComposerScreen environment={environment} tag={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
