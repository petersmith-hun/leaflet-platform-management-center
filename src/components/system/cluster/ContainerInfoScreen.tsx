import { ClusterMonitoringAPIEnvironment } from "@/api-environment";
import { PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { createClusterStatus } from "@/components/system/cluster/cluster-status-factory";
import { ContainerDetailsCard } from "@/components/system/cluster/ContainerDetailsCard";
import { defaultDetails, defaultStat, defaultState } from "@/components/system/cluster/index";
import { ContainerCountIndicator, UtilizationIndicator } from "@/components/system/cluster/UtilizationIndicator";
import { clusterMonitoringFacade } from "@/core/facade/cluster-monitoring-facade";
import { Container, ContainerView } from "@/core/model/cluster";
import { noOpPagination } from "@/core/model/common";
import { faCheckCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ContainerInfoProps {
  environment: ClusterMonitoringAPIEnvironment;
  containers: Container[];
}

/**
 * Renders the cluster monitor screen.
 *
 * @param environment ClusterMonitoringAPIEnvironment object defining the target API configuration
 * @param containers list of registered containers
 */
export const ContainerInfoScreen = ({ environment, containers }: ContainerInfoProps): ReactNode => {

  const { t } = useTranslation();
  const router = useRouter();
  const { startDockerMonitoring } = clusterMonitoringFacade(environment, router, containers);
  const subscribed = useRef(false);
  const [stats, setStats] = useState(defaultState(containers, defaultStat));
  const [details, setDetails] = useState(defaultState(containers, defaultDetails));

  useEffect(() => {

    if (subscribed.current) {
      return;
    }

    subscribed.current = true;
    startDockerMonitoring({ setDetails, setStats });
  }, []);

  const clusterStatus = createClusterStatus(containers, details, stats);

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        {clusterStatus.countStopped ? (
          <SimpleCard>
            <p className="text-warning flex flex-row">
              <FontAwesomeIcon className="w-8 h-8 mr-2" icon={faWarning} />
              <span className="pt-1">
                {t("system.cluster.label.alert.not-running-containers", { count: clusterStatus.countStopped })}</span>
            </p>
          </SimpleCard>
        ) : null}
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.system.cluster.status.container-info"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.system.cluster.status.container-status"} widthClass={"w-2/12"} />
          <ItemListHeaderItem titleKey={"header.system.cluster.status.cpu-utilization"} widthClass={"w-2/12"} />
          <ItemListHeaderItem titleKey={"header.system.cluster.status.memory-utilization"} widthClass={"w-2/12"} />
        </ItemListHeader>
        <ItemListBody data={clusterStatus.containers}>
          {(view: ContainerView) => <ContainerDetailsCard key={`container-${view.id}`} containerView={view} />}
        </ItemListBody>
      </ItemListPane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.cluster.summary")}>
          <div className="flex flex-row text-center">
            <div className="flex flex-col flex-grow">
              <div
                className="text-xs text-neutral-300 py-2">{t("system.cluster.label.summary.number-of-containers")}</div>
              <div>
                <ContainerCountIndicator stopped={clusterStatus.countStopped} total={clusterStatus.containers.length} />
              </div>
              {clusterStatus.countStopped ? (
                <div className="text-xs text-warning py-2">
                  <FontAwesomeIcon className="mr-1" icon={faWarning} />
                  {t("system.cluster.label.summary.count-stopped", { count: clusterStatus.countStopped })}
                </div>
              ) : null}
              {!clusterStatus.countStopped ? (
                <div className="text-xs text-success py-2">
                  <FontAwesomeIcon className="mr-1" icon={faCheckCircle} />
                  {t("system.cluster.label.summary.all-running")}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col flex-grow">
              <div className="text-xs text-neutral-300 py-2">{t("system.cluster.label.summary.total-cpu")}</div>
              <div>
                <UtilizationIndicator percentage={clusterStatus.totalCPUUsagePercentage} />
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="text-xs text-neutral-300 py-2">{t("system.cluster.label.summary.total-ram")}</div>
              <div>
                <UtilizationIndicator percentage={clusterStatus.totalRAMUsagePercentage} />
              </div>
              <div className="text-xs text-neutral-300 py-2">{clusterStatus.totalRAMUsageMB} MB</div>
            </div>
          </div>
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
