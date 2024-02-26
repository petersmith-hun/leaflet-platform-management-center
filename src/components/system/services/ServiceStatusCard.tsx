import { ItemListCard } from "@/components/common/Cards";
import { SimpleLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { Separator } from "@/components/common/Separator";
import { ServiceStatus } from "@/core/model/cluster";
import { dateFormatter } from "@/core/util/date-formatter";
import {
  faCalendarPlus,
  faCheckCircle,
  faCloud,
  faCode,
  faFingerprint,
  faWarning
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ServiceStatusCardProps {
  service: ServiceStatus;
}

const ServiceStatusIndicator = ({ service }: ServiceStatusCardProps): ReactNode => {

  if (service.up === "polling") {
    return <SimpleLoadingIndicator sizeOverride={20} />
  }

  return service.up
    ? <FontAwesomeIcon className="w-20 h-20 text-success" icon={faCheckCircle} />
    : <FontAwesomeIcon className="w-20 h-20 text-danger" icon={faWarning} />;
}

/**
 * Renders a card showing the status details of the given service.
 *
 * @param service ServiceStatus object containing the details of a service's status
 */
export const ServiceStatusCard = ({ service }: ServiceStatusCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <FontAwesomeIcon icon={faCloud} /> {service.app.abbreviation}
        </h5>
        {service.app.name && (
          <>
            <Separator thick={false} />
            <span className="text-xs">
              <FontAwesomeIcon className="h-4 w-4 mr-1" icon={faFingerprint} /> {service.app.name}
            </span>
          </>
        )}
        {!service.up && (
          <>
            <Separator thick={false} />
            <span className="text-xs">
              <FontAwesomeIcon className="h-4 w-4 mr-1" icon={faWarning} /> {t("system.services.label.no-healthcheck-response")}
            </span>
          </>
        )}
      </div>
      <div className="w-2/12 text-center">
        <ServiceStatusIndicator service={service} />
      </div>
      <div className="w-5/12">
        {service.up && (
          <>
            <span>
              <FontAwesomeIcon className="w-4 h-4" icon={faCode} /> {service.build.version}
              <br />
              <FontAwesomeIcon className="w-4 h-4" icon={faCalendarPlus} /> {dateFormatter(service.build.time)}
            </span>
          </>
        )}
      </div>
    </ItemListCard>
  )
}
