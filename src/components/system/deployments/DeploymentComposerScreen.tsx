import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { TabbedScreen } from "@/components/common/TabbedScreen";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { ExecutionConfigurationTab } from "@/components/system/deployments/composer/ExecutionConfigurationTab";
import { HealthcheckConfigurationTab } from "@/components/system/deployments/composer/HealthcheckConfigurationTab";
import { InfoConfigurationTab } from "@/components/system/deployments/composer/InfoConfigurationTab";
import { SourceConfigurationTab } from "@/components/system/deployments/composer/SourceConfigurationTab";
import { TargetConfigurationTab } from "@/components/system/deployments/composer/TargetConfigurationTab";
import { mapToDeploymentForm } from "@/components/system/deployments/converters/definition-to-form";
import { mapToDeployment } from "@/components/system/deployments/converters/form-to-definition";
import { Deployment, DeploymentForm, SourceType } from "@/core/model/domino";
import { dominoService } from "@/core/service/domino-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface DeploymentComposerScreenProps {
  environment: APIEnvironment;
  deployment?: Deployment;
  mutate?: KeyedMutator<Deployment>;
}

const getDefaultState = (currentState?: boolean): boolean => {
  return currentState === undefined ? true : currentState
}

/**
 * Screen used by Domino deployment definition create/edit operations. For editing purpose, provide the definition
 * itself, as well as an SWR mutate function to invalidate the cache for the edited definition.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param deployment deployment definition data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const DeploymentComposerScreen = ({ environment, deployment, mutate }: DeploymentComposerScreenProps): ReactNode => {

  const { createDeployment, updateDeployment } = dominoService(environment);
  const { t } = useTranslation();
  const [selectedSourceType, setSelectedSourceType] = useState<string>(deployment?.source.type ?? SourceType.DOCKER);
  const { register, handleSubmit, formState: { errors } } = useForm<DeploymentForm>({
    defaultValues: mapToDeploymentForm(deployment)
  });
  const router = useRouter();
  const deploymentID = router.query.id as string | undefined;

  const saveDeployment = (deploymentForm: DeploymentForm): Promise<Deployment> => {

    const deployment = mapToDeployment(deploymentForm);

    return deploymentID
      ? updateDeployment(deploymentID, deployment)
      : createDeployment(deployment);
  };

  return (
    <SubmitOperation domain={"deployment"} mutate={mutate} titleSupplier={deployment => deployment.id}
                     handleSubmit={handleSubmit}
                     serviceCall={saveDeployment}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={deployment?.id
            ? t("page.title.system.deployment.edit", { id: deployment.id })
            : t("page.title.system.deployment.create")}>
            <TabbedScreen
              titles={[
                t("tab.deployment.create.source"),
                t("tab.deployment.create.target"),
                t("tab.deployment.create.execution"),
                t("tab.deployment.create.healthcheck"),
                t("tab.deployment.create.info")
              ]}>
              <SourceConfigurationTab register={register} errors={errors} setSelectedSourceType={setSelectedSourceType} />
              <TargetConfigurationTab register={register} errors={errors} />
              <ExecutionConfigurationTab register={register} errors={errors} selectedSourceType={selectedSourceType} />
              <HealthcheckConfigurationTab register={register} errors={errors} defaultState={getDefaultState(deployment?.healthcheck.enabled)} />
              <InfoConfigurationTab register={register} errors={errors} defaultState={getDefaultState(deployment?.info.enabled)} />
            </TabbedScreen>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.article")}>
            <PageOperationButton label={t("page-operations.deployment.back-to-definitions")} icon={faList}
                                 link={"/system/deployments"} />
            {deployment && <PageOperationButton label={t("page-operations.deployment.view")} icon={faEye}
                                                link={`/system/deployments/view/${deployment.id}`} />}
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
