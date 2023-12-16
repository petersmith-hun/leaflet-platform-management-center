import { dateFormatter } from "@/core/util/date-formatter";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface FormattedArticleDataProps {
  date: string;
  icon: IconDefinition;
}

/**
 * Renders the given date with a purpose-indicator icon.
 *
 * @param date date (as string) to be rendered
 * @param icon indicator icon as FontAwesome IconDefinition
 */
export const FormattedArticleDate = ({ date, icon }: FormattedArticleDataProps): ReactNode => {

  if (!date) {
    return null;
  }

  return (
    <p>
      <FontAwesomeIcon className="w-4" icon={icon} /> {dateFormatter(date)}
    </p>
  )
}
