import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Tooltip } from "@/components/common/Tooltip";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { FrontEndRouteDataModel } from "@/core/model/routes";
import { routesService } from "@/core/service/routes-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faLocationArrow, faPencil, faRoute, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewRouteDetailsScreenProps {
  environment: APIEnvironment;
  route: FrontEndRouteDataModel;
  mutate: KeyedMutator<FrontEndRouteDataModel>;
}

const RouteIDTooltip = (): ReactNode => {
  return <Tooltip tooltipKey={"system.route.label.route-id"} />
}

/**
 * Frontend route viewer screen component. Renders a static page with all information of the given frontend route.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param route data of an existing frontend route
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewRouteDetailsScreen = ({ environment, route, mutate }: ViewRouteDetailsScreenProps): ReactNode => {

  const { changeGeneralStatus, deleteRouteByID } = routesService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={route.name}>
          <DataRow>
            <WideDataCell title={t("forms:route.edit.route-id")}>
              {route.routeId} <RouteIDTooltip />
            </WideDataCell>
            <NarrowDataCell title={t("forms:route.edit.general-status")}>
              <ItemEnabledStatusFlag item={route} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:route.edit.name")} children={route.name} />
            <NarrowDataCell title={t("forms:route.edit.type")}>
              <FontAwesomeIcon className="w-4 h-4" icon={faLocationArrow} /> {t(`forms:route.edit.type.${route.type}`)}
            </NarrowDataCell>
            <NarrowDataCell title={t("forms:route.edit.auth-requirement")}>
              <FontAwesomeIcon className="w-4 h-4" icon={faUserShield} /> {t(`forms:route.edit.auth-requirement.${route.authRequirement}`)}
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:route.edit.url")}>
              <FontAwesomeIcon className="w-4 h-4" icon={faRoute} /> {route.url}
            </WideDataCell>
            <NarrowDataCell title={t("forms:route.edit.created-at")} children={dateFormatter(route.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:route.edit.sequence-number")} children={route.sequenceNumber} />
            <NarrowDataCell title={t("forms:route.edit.last-modified-at")}
                            children={dateFormatter(route.lastModified) ?? t("document.label.never-modified")} />
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.route")}>
          <PageOperationButton label={t("page-operations.route.edit")} icon={faPencil}
                               link={`/system/routes/edit/${route.id}`} />
          <PageOperationButton label={t("page-operations.route.back-to-routes")} icon={faList}
                               link={"/system/routes"} />
          <GeneralStatusUpdateOperation domain={"route"} entity={route}
                                        titleSupplier={route => route.name}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <DeleteOperation domain={"route"} entity={route} titleSupplier={route => route.name}
                           serviceCall={deleteRouteByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
