import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewSecretScreen } from "@/components/system/secrets/ViewSecretScreen";
import { secretService } from "@/core/service/secret-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View secret details page.
 * Mapped to /system/secrets/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewSecret(environment: APIEnvironment) {

  const { getSecretMetadata } = secretService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrStringKey("secrets/view", router.query.id), key => getSecretMetadata(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.secret.view"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewSecretScreen secret={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
