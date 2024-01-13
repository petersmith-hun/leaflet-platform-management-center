import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ViewCommentScreen } from "@/components/comments/ViewCommentScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { commentService } from "@/core/service/comment-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View comment page.
 * Mapped to /comments/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewComment(environment: APIEnvironment) {

  const { getCommentByID } = commentService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("comments/view", router.query.id), key => getCommentByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.comment.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewCommentScreen comment={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
