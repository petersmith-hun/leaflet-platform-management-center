import { ScreenParameters } from "@/api-environment";
import { OAuthApplicationCard } from "@/components/access/oauth/OAuthApplicationCard";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { convertPageMeta } from "@/components/utility/page-converter";
import { SimplifiedPageModel } from "@/core/model/common";
import { OAuthApplicationSummaryModel } from "@/core/model/oauth";
import { oauthApplicationService } from "@/core/service/oauth-applications-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface OAuthApplicationListResultProps {
  applications: SimplifiedPageModel<OAuthApplicationSummaryModel>;
}

const OAuthApplicationListResult = ({ applications }: OAuthApplicationListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={convertPageMeta(applications)}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.oauth-application.name-and-client-id"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.oauth-application.application-type"} widthClass={"w-1/12"} />
        <ItemListHeaderItem titleKey={"header.oauth-application.status"} widthClass={"w-1/12"} />
        <ItemListHeaderItem titleKey={"header.oauth-application.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.oauth-application.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={applications.content}>
        {(application: OAuthApplicationSummaryModel) => <OAuthApplicationCard key={`oauth-application-${application.id}`} application={application} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of OAuth application manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const OAuthApplicationListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllApplications } = oauthApplicationService(environment);
  const { query } = useRouter();
  const { isLoading, data, error } = useSWR(swrNumberKey("oauth-applications/page", query.page ?? 1), key => getAllApplications(key.parameter));

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <OAuthApplicationListResult applications={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.oauth-application")}>
          <PageOperationButton label={t("page-operations.oauth-application.new")} icon={faEdit} link="/access/oauth-applications/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
