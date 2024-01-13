import environmentProperties, { APIEnvironment } from "@/api-environment";
import { CommentComposerScreen } from "@/components/comments/CommentComposerScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { commentService } from "@/core/service/comment-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Edit comment page.
 * Mapped to /comments/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditComment(environment: APIEnvironment) {

  const { getCommentByID } = commentService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("comments/edit", router.query.id), (key) => getCommentByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.comment.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <CommentComposerScreen environment={environment} comment={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
