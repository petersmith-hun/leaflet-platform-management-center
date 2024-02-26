import { ClusterMonitoringAPIEnvironment } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { ContainerCountIndicator } from "@/components/system/cluster/UtilizationIndicator";
import { createServiceStatusSummary, defaultStatusState } from "@/components/system/services/index";
import { ServiceStatusCard } from "@/components/system/services/ServiceStatusCard";
import { clusterMonitoringFacade } from "@/core/facade/cluster-monitoring-facade";
import { RegisteredServices } from "@/core/model/cluster";
import { noOpPagination } from "@/core/model/common";
import { faCheckCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ServiceDashboardScreenProps {
  environment: ClusterMonitoringAPIEnvironment;
  services: RegisteredServices;
}

/**
 * Renders the service dashboard (healthcheck) screen.
 *
 * @param environment ClusterMonitoringAPIEnvironment object defining the target API configuration
 * @param services list of registered services as reported by the registered-services endpoint
 */
export const ServiceDashboardScreen = ({ environment, services }: ServiceDashboardScreenProps): ReactNode => {

  const { executeHealthcheck } = clusterMonitoringFacade(environment, useRouter(), []);
  const { t } = useTranslation();
  const subscribed = useRef(false);
  const [healthcheck, setHealthcheck] = useState(defaultStatusState(services));

  useEffect(() => {

    if (subscribed.current) {
      return;
    }

    subscribed.current = true;
    executeHealthcheck({ setHealthcheck });
  }, []);

  const serviceStatusSummary = createServiceStatusSummary(healthcheck);

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.system.services.name"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.system.services.status"} widthClass={"w-2/12"} />
          <ItemListHeaderItem titleKey={"header.system.services.build-info"} widthClass={"w-5/12"} />
        </ItemListHeader>
        <ItemListBody data={Object.values(healthcheck)}>
          {service => <ServiceStatusCard key={`service-${service.app.abbreviation}`} service={service} />}
        </ItemListBody>
      </ItemListPane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.services.summary")}>
          <div className="flex flex-row text-center">
            <div className="flex flex-col flex-grow">
              <div
                className="text-xs text-neutral-300 py-2">{t("system.services.label.summary.number-of-services")}</div>
              <div>
                <ContainerCountIndicator stopped={serviceStatusSummary.countNotResponding} total={serviceStatusSummary.countAll} />
              </div>
              {serviceStatusSummary.countNotResponding ? (
                <div className="text-xs text-warning py-2">
                  <FontAwesomeIcon className="mr-1" icon={faWarning} />
                  {t("system.services.label.summary.count-service-down", { count: serviceStatusSummary.countNotResponding })}
                </div>
              ) : null}
              {!serviceStatusSummary.countNotResponding ? (
                <div className="text-xs text-success py-2">
                  <FontAwesomeIcon className="mr-1" icon={faCheckCircle} />
                  {t("system.services.label.summary.all-up")}
                </div>
              ) : null}
            </div>
          </div>
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
