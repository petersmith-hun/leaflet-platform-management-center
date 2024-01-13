import environmentProperties, { APIEnvironment } from "@/api-environment";
import { CommentListScreen } from "@/components/comments/CommentListScreen";
import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * View comments or article page.
 * Mapped to /comments/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewCommentsOfArticle(environment: APIEnvironment) {

  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);

  useEffect(() => {
    updatePageTitle(t("page.title.comment.list"));
  }, []);

  return <CommentListScreen environment={environment} />
}
