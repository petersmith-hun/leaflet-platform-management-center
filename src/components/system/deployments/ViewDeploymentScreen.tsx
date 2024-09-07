import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { descriptionMapping } from "@/components/system/deployments";
import { ArrayArgument } from "@/components/system/deployments/details/common";
import { DockerArgumentsBlock } from "@/components/system/deployments/details/DockerArgumentsBlock";
import { HealthcheckBlock } from "@/components/system/deployments/details/HealthcheckBlock";
import { InfoBlock } from "@/components/system/deployments/details/InfoBlock";
import { Deployment, DockerArguments, SourceType } from "@/core/model/domino";
import { faDice, faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewDeploymentScreenProps {
  deployment: Deployment;
  environment: APIEnvironment;
  mutate: KeyedMutator<Deployment>;
}

/**
 * Domino deployment definition details viewer screen component. Renders a static page with all information of the
 * given deployment definition.
 *
 * @param deployment data of an existing deployment definition
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewDeploymentScreen = ({ deployment, environment, mutate }: ViewDeploymentScreenProps): ReactNode => {

  const { t } = useTranslation();
  const notApplicable = t("system.deployments.label.not-applicable");

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={t("page.sub-title.system.deployments.source-config", { id: deployment.id })}
                       icon={faDice}>
          <DataRow>
            <WideDataCell title={t("forms:deployment.edit.id")} children={deployment.id} />
            <WideDataCell title={t("forms:deployment.edit.source-type")}
                          children={t(descriptionMapping.get(deployment.source.type)!)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:deployment.edit.source-home")} children={deployment.source.home} />
            <WideDataCell title={t("forms:deployment.edit.source-resource")} children={deployment.source.resource} />
          </DataRow>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.system.deployments.target-config")}>
          <DataRow>
            <WideDataCell title={t("forms:deployment.edit.target-host")}>
              <ArrayArgument items={deployment.target.hosts} />
            </WideDataCell>
          </DataRow>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.system.deployments.execution-config")}>
          <DataRow>
            <WideDataCell title={t("forms:deployment.edit.execution-via")}
                          children={t(descriptionMapping.get(deployment.execution.via)!)} />
            <WideDataCell title={t("forms:deployment.edit.execution-runtime")}
                          children={deployment.execution.runtime ?? notApplicable} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:deployment.edit.execution-user")}
                          children={deployment.execution.asUser ?? notApplicable} />
            <WideDataCell title={t("forms:deployment.edit.execution-command-name")}
                          children={deployment.execution.commandName ?? notApplicable} />
          </DataRow>
          {deployment.source.type === SourceType.DOCKER && (
            <DockerArgumentsBlock dockerArgs={deployment.execution.args as DockerArguments} />
          )}
          {deployment.source.type === SourceType.FILESYSTEM && (
            <DataRow>
              <WideDataCell title={t("forms:deployment.edit.execution-args")}>
                <ArrayArgument items={deployment.execution.args} />
              </WideDataCell>
            </DataRow>
          )}
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.system.deployments.healthcheck-config")}>
          <HealthcheckBlock healthcheck={deployment.healthcheck} />
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.system.deployments.info-config")}>
          <InfoBlock info={deployment.info} />
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.deployment")}>
          <PageOperationButton label={t("page-operations.deployment.back-to-definitions")} icon={faList}
                               link={"/system/deployments"} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
