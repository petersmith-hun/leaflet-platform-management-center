import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ViewOAuthApplicationScreen } from "@/components/access/oauth/ViewOAuthApplicationScreen";
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
 * View OAuth application page.
 * Mapped to /access/oauth-applications/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewOAuthApplication(environment: APIEnvironment) {

  const { getApplicationByID } = oauthApplicationService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrStringKey("oauth-applications/view", router.query.id), key => getApplicationByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.oauth-application.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewOAuthApplicationScreen application={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
