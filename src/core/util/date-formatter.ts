import { DateTime } from "luxon";

/**
 * TODO.
 * @param dateString
 */
export const dateFormatter = (dateString: string): string => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_FULL);
}
