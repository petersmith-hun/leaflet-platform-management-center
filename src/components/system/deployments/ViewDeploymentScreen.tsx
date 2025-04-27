import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { ToastType } from "@/components/common/OperationResultToast";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { AwarenessLevel, ConfirmedOperationButton, PageOperationButton } from "@/components/navigation/OperationButton";
import { descriptionMapping } from "@/components/system/deployments";
import { ArrayArgument } from "@/components/system/deployments/details/common";
import {
  DeploymentExportModal,
  ExportDeploymentButton
} from "@/components/system/deployments/details/DeploymentExportModal";
import { DockerArgumentsBlock } from "@/components/system/deployments/details/DockerArgumentsBlock";
import { HealthcheckBlock } from "@/components/system/deployments/details/HealthcheckBlock";
import { InfoBlock } from "@/components/system/deployments/details/InfoBlock";
import { toastHandler } from "@/components/utility/toast-handler";
import { Deployment, DockerArguments, SourceType } from "@/core/model/domino";
import { dominoService } from "@/core/service/domino-service";
import { PageContext } from "@/pages/_app";
import { faDice, faList, faLock, faLockOpen, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useCallback, useContext, useState } from "react";
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
  const { exportDeployment, unlockDeployment, deleteDeployment } = dominoService(environment);
  const notApplicable = t("system.deployments.label.not-applicable");
  const [exportedDeployment, setExportedDeployment] = useState("");

  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  const handleUnlock = (): void => {

    setOperationInProgress(true);
    unlockDeployment(deployment.id)
      .then(_ => mutate())
      .then(_ => showCustomToast(
        t(`toast.template.title.success.updated`, {
          domain: t(`domain.deployment`)
        }),
        t(`toast.deployment.unlock.success.message`, {
          id: deployment.id
        }), ToastType.SUCCESS
      ))
      .catch(_ => showCustomErrorToast(
        t(`toast.template.title.failure`, {
          domain: t(`domain.deployment`)
        }),
        t(`toast.deployment.unlock.failure.message`, {
          id: deployment.id
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  const renderExportedDeployment = useCallback(() => {

    exportDeployment(deployment.id)
      .then(deployment => {
        setExportedDeployment(deployment.definition);
      });

  }, []);

  return (
    <MultiPaneScreen>
      <WidePane>
        {deployment.metadata?.locked ? (
          <SimpleCard>
            <span className="inline-block text-warning text-lg">
              <FontAwesomeIcon icon={faLock} /> {t("system.deployments.label.locked-for-modification")}
            </span>
          </SimpleCard>
        ) : null}
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
          {deployment.metadata?.locked ? (
            <ConfirmedOperationButton label={t("page-operations.deployment.unlock")} icon={faLockOpen}
                                      id={`deployment-${deployment.id}`}
                                      popconfirmDomain={"deployment"} operation="deployment-unlock"
                                      onSubmit={handleUnlock}
                                      awareness={AwarenessLevel.WARNING} />
          ) : (
            <>
              <PageOperationButton label={t("page-operations.deployment.edit")} icon={faPencil}
                                   link={`/system/deployments/edit/${deployment.id}`} />
              <DeleteOperation domain={"deployment"} entity={deployment} titleSupplier={deployment => deployment.id}
                               serviceCall={deleteDeployment} />
            </>
          )}
          <ExportDeploymentButton onClick={renderExportedDeployment} />
        </PageOperationCard>
      </NarrowPane>
      <DeploymentExportModal exportedDeployment={exportedDeployment} />
    </MultiPaneScreen>
  )
}
