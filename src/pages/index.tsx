import environmentProperties, { APIEnvironment } from "@/api-environment";
import { UnreviewedCommentList } from "@/components/comments/CommentListScreen";
import { SimpleCard } from "@/components/common/Cards";
import { MultiPaneScreen, WidePane } from "@/components/common/ScreenLayout";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { PageContext } from "@/pages/_app";
import { faHandPeace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * Home page component.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Home(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { getUserInfo } = useSessionHelper();

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.home"));
  }, []);

  return (
    <>
      <MultiPaneScreen>
        <WidePane>
          <SimpleCard>
            <p className="text-lg">
              <FontAwesomeIcon className="w-8 h-8" icon={faHandPeace} /> {t("home.label.welcome", { username: getUserInfo().name })}
            </p>
          </SimpleCard>
        </WidePane>
      </MultiPaneScreen>
      <UnreviewedCommentList environment={environment} />
    </>
  )
}
