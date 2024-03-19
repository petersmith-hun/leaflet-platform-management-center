import { Separator } from "@/components/common/Separator";
import { dateFormatter } from "@/core/util/date-formatter";
import { faCheckCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface LastEventIndicatorProps {
  eventDate: string | null;
  eventType: "last-served" | "last-mirrored";
}

const isPositive = ({ eventDate, eventType }: LastEventIndicatorProps): boolean => {

  return (eventType === "last-served" && eventDate === null)
    || (eventType === "last-mirrored" && eventDate !== null);
}

/**
 * Renders a row showing an event type and the date when it last happened.
 *
 * @param eventDate date of the event as string or null if not applicable
 * @param eventType type of the event to be rendered
 */
export const LastEventIndicator = ({ eventDate, eventType }: LastEventIndicatorProps): ReactNode => {

  const { t } = useTranslation();
  const positive = isPositive({ eventDate, eventType });

  return (
    <>
      <Separator thick={false} />
      <div className="text-xs text-neutral-300 py-2">{t(`system.failover.label.${eventType}`)}</div>
      <br />
      <div className={`${positive ? "text-success" : "text-warning"} py-2`}>
        <FontAwesomeIcon icon={positive ? faCheckCircle : faWarning} /> {dateFormatter(eventDate) ?? t("system.failover.label.never")}
      </div>
    </>
  )
}
