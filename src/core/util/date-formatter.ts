import { DateTime } from "luxon";

/**
 * Renders the given date string using the Luxon formatter. The pattern adheres the browser's locale and is a full date-time pattern.
 * If falsy value is provided, returns empty string.
 *
 * @param dateString date string to be formatted
 */
export const dateFormatter = (dateString?: string | null): string | undefined => {

  return dateString
    ? DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_FULL)
    : "";
}
