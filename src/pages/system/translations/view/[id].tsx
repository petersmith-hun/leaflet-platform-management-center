import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewTranslationPackScreen } from "@/components/system/translations/ViewTranslationPackScreen";
import { translationService } from "@/core/service/translation-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View translation pack details page.
 * Mapped to /system/translations/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewPack(environment: APIEnvironment) {

  const { getPackByID } = translationService(environment);
  const router = useRouter();
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrStringKey("translations/view", router.query.id), key => getPackByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.system.translation.view"));
  }, []);


  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewTranslationPackScreen pack={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
