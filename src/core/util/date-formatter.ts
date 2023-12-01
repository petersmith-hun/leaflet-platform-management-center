import { DateTime } from "luxon";

/**
 * TODO.
 * @param dateString
 */
export const dateFormatter = (dateString: string): string | undefined => {

  return dateString
    ? DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_FULL)
    : undefined;
}
