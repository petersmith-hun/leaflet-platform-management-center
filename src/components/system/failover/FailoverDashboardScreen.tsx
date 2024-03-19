import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { BackedUpItemCountIndicator } from "@/components/system/failover/BackedUpItemCountIndicator";
import { FailoverStatusIndicator } from "@/components/system/failover/FailoverStatusIndicator";
import { LastEventIndicator } from "@/components/system/failover/LastEventIndicator";
import { LatestEventsTable } from "@/components/system/failover/LatestEventsTable";
import { FailoverStatusResponse } from "@/core/model/failover";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface FailoverDashboardScreenProps {
  failover: FailoverStatusResponse;
}

/**
 * Screen component for showing failover details.
 *
 * @param failover failover information to be rendered
 */
export const FailoverDashboardScreen = ({ failover }: FailoverDashboardScreenProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={t("system.failover.label.number-of-items-backed-up")}>
          <div className="flex flex-row flex-grow text-center">
            {failover.mirrorStatus.map(mirrorStatus => (
              <BackedUpItemCountIndicator key={`item-count-${mirrorStatus.mirrorType}`} mirrorStatus={mirrorStatus} />)
            )}
          </div>
        </CardWithTitle>
        <CardWithTitle title={t("system.failover.label.latest-events")}>
          <LatestEventsTable failover={failover} />
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.failover")}>
          <div className="flex flex-row text-center">
            <div className="flex flex-col flex-grow">
              <FailoverStatusIndicator failover={failover} />
              <LastEventIndicator eventDate={failover.lastCall} eventType={"last-served"} />
              <LastEventIndicator eventDate={failover.lastMirroring} eventType={"last-mirrored"} />
            </div>
          </div>
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
