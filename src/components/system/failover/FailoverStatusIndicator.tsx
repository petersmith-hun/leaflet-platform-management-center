import { FailoverStatus, FailoverStatusResponse } from "@/core/model/failover";
import { faCheckCircle, faSync, faWarning, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface FailoverDashboardScreenProps {
  failover: FailoverStatusResponse;
}

const textClassMap = new Map<FailoverStatus, string>([
  [FailoverStatus.STANDBY, "text-success"],
  [FailoverStatus.SERVING, "text-danger"],
  [FailoverStatus.MIRRORING, "text-warning"],
  [FailoverStatus.MIRRORING_FAILURE, "text-danger"]
]);

const iconMap = new Map<FailoverStatus, IconDefinition>([
  [FailoverStatus.STANDBY, faCheckCircle],
  [FailoverStatus.SERVING, faWarning],
  [FailoverStatus.MIRRORING, faSync],
  [FailoverStatus.MIRRORING_FAILURE, faSync]
]);

/**
 * Renders the overall failover status indicator.
 *
 * @param failover failover information to be rendered
 */
export const FailoverStatusIndicator = ({ failover }: FailoverDashboardScreenProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <div className={`text ${textClassMap.get(failover.status)}`}>
        <FontAwesomeIcon className="my-1 h-20 w-20" icon={iconMap.get(failover.status)!} />
        <br />
        {t(`system.failover.label.status.${failover.status}`)}
      </div>
    </>
  )
}
