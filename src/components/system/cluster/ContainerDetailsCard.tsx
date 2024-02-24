import { ItemListCard } from "@/components/common/Cards";
import { Separator } from "@/components/common/Separator";
import { ContainerStatusIcon } from "@/components/system/cluster/ContainerStatusIcon";
import { UtilizationIndicator } from "@/components/system/cluster/UtilizationIndicator";
import { ContainerStatus, ContainerView } from "@/core/model/cluster";
import { dateFormatter } from "@/core/util/date-formatter";
import { faDocker } from "@fortawesome/free-brands-svg-icons";
import { faCalendarPlus, faFileText, faFingerprint, faTag, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ContainerDetailsCardProps {
  containerView: ContainerView;
}

const calculateUptime = (containerView: ContainerView): string => {

  const startedAt = DateTime.fromISO(containerView.startedAt);

  return DateTime.now()
    .reconfigure({ locale: "en" })
    .diff(startedAt, ["days", "hours", "minutes", "seconds"])
    .toHuman({ unitDisplay: "short", notation: "standard", maximumFractionDigits: 0 });
}

/**
 * Renders a card showing the details of the given container.
 *
 * @param containerView ContainerView object containing details of the container
 */
export const ContainerDetailsCard = ({ containerView }: ContainerDetailsCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard key={`container-stat-${containerView.id}-${new Date().getTime()}`}>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <FontAwesomeIcon icon={faDocker} /> {containerView.name}
        </h5>
        <Separator thick={false} />
        <span>
          <FontAwesomeIcon className="h-4 w-4" icon={faFingerprint} /> {containerView.id}
        </span>
        <span>
          <FontAwesomeIcon className="ml-2 h-4 w-4" icon={faTag} /> {containerView.image}
        </span>
        {containerView.status !== ContainerStatus.UNKNOWN && (
          <>
            <span>
              <FontAwesomeIcon className="pl-2 h-4 w-4"
                               icon={faCalendarPlus} /> {dateFormatter(containerView.startedAt)}
            </span>
            <br />
            <span title={containerView.logFilePath} className="text-xs">
              <FontAwesomeIcon className="h-4 w-4" icon={faFileText} /> {containerView.logFilePathShort}
            </span>
          </>
        )}
        {containerView.status === ContainerStatus.UNKNOWN && (
          <span className="text-warning">
            <FontAwesomeIcon className="ml-2 mr-1 h-4 w-4" icon={faWarning} />
            {t("system.cluster.label.alert.awaiting-data")}
          </span>
        )}
      </div>
      <div className="w-2/12 text-center">
        <ContainerStatusIcon containerView={containerView} />
        <br />
        <div className="text-center text-xs text-neutral-300 pt-2">
          {containerView.status === ContainerStatus.RUNNING
            ? calculateUptime(containerView)
            : t(`system.cluster.label.status.${containerView.status}`)
          }
        </div>
      </div>
      <div className="w-2/12 text-center">
        <UtilizationIndicator percentage={containerView.cpuUsagePercent} />
      </div>
      <div className="w-2/12 text-center">
        <UtilizationIndicator percentage={containerView.memoryUsagePercent} />
        <br />
        <div className="text-center text-xs text-neutral-300 pt-2">{containerView.memoryUsageActual} MB</div>
      </div>
    </ItemListCard>
  )
}
