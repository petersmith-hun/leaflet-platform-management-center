import { ScreenParameters } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { DeploymentCard } from "@/components/system/deployments/DeploymentCard";
import { ResponseWrapper } from "@/core/model/common";
import { DeploymentSummary } from "@/core/model/domino";
import { dominoService } from "@/core/service/domino-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface DominoDeploymentsProps {
  deployments: ResponseWrapper<DeploymentSummary[]>;
}

const DominoDeploymentsList = ({ deployments }: DominoDeploymentsProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={deployments.pagination}>
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.deployment.coordinates"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.deployment.home-and-resource"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.deployment.operations"} widthClass={"w-2/12"} />
        </ItemListHeader>
        <ItemListBody data={deployments.body}>
          {(deployment: DeploymentSummary) => <DeploymentCard deployment={deployment} key={`deployment-${deployment.id}`} />}
        </ItemListBody>
      </ItemListPane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.deployment")}>
          <PageOperationButton label={t("page-operations.deployment.new")} icon={faEdit} link="/system/deployments/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}

/**
 * Screen component for listing the existing deployments.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const DominoDeploymentsListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { getDeployments } = dominoService(environment);
  const { query } = useRouter();
  const { isLoading, error, data } = useSWR(swrNumberKey("system/domino-deployments", query.page ?? 1), key => getDeployments(key.parameter));

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <DominoDeploymentsList deployments={data!} />}
    </SWRManagedScreen>
  )
}
