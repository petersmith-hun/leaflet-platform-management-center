import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { RouteCard } from "@/components/system/routes/RouteCard";
import { noOpPagination } from "@/core/model/common";
import { FrontEndRouteDataModel } from "@/core/model/routes";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface RouteListProps {
  routes: FrontEndRouteDataModel[];
  filter: (route: FrontEndRouteDataModel) => boolean;
  title: string;
  showOperations?: boolean;
}

const routeSortFunction = (first: FrontEndRouteDataModel, second: FrontEndRouteDataModel) => first.sequenceNumber - second.sequenceNumber;

/**
 * Renders a frontend route list segment on the route management main UI. Filter can be used to display the routes split
 * to different panels based on some property value.
 *
 * @param routes all retrieve frontend route data
 * @param filter data filter expression
 * @param title segment title
 * @param showOperations page operations box can be disabled for the 2nd, 3rd, etc. boxes
 */
export const RouteList = ({ routes, filter, title, showOperations = false }: RouteListProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        <ItemListHeader title={title}>
          <ItemListHeaderItem titleKey={"header.routes.key-and-target"} widthClass={"w-4/12"} />
          <ItemListHeaderItem titleKey={"header.routes.type-and-auth"} widthClass={"w-3/12"} />
          <ItemListHeaderItem titleKey={"header.routes.dates"} widthClass={"w-3/12"} />
          <ItemListHeaderItem titleKey={"header.routes.status"} widthClass={"w-1/12"} />
          <ItemListHeaderItem titleKey={"header.routes.operations"} widthClass={"w-1/12"} />
        </ItemListHeader>
        <ItemListBody data={routes.filter(filter).sort(routeSortFunction)}>
          {(route: FrontEndRouteDataModel) => <RouteCard route={route} key={`route-${route.routeId}`} />}
        </ItemListBody>
      </ItemListPane>
      {showOperations && (
        <NarrowPane>
          <PageOperationCard title={t("page-operations.route")}>
            <PageOperationButton label={t("page-operations.route.new")} icon={faEdit} link="/system/routes/create" />
          </PageOperationCard>
        </NarrowPane>
      )}
    </MultiPaneScreen>
  )
}
