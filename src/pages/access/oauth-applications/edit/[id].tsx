import environmentProperties, { APIEnvironment } from "@/api-environment";
import { OAuthApplicationComposerScreen } from "@/components/access/oauth/OAuthApplicationComposerScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { oauthApplicationService } from "@/core/service/oauth-applications-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Edit OAuth application page.
 * Mapped to /access/oauth-applications/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditOAuthApplication(environment: APIEnvironment) {

  const { getApplicationByID } = oauthApplicationService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrStringKey("oauth-applications/edit", router.query.id), key => getApplicationByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.oauth-application.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <OAuthApplicationComposerScreen application={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
