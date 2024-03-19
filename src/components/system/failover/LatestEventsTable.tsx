import { FailoverStatusResponse } from "@/core/model/failover";
import { dateFormatter } from "@/core/util/date-formatter";
import { ReactNode, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface LatestEventsTableProps {
  failover: FailoverStatusResponse;
}

/**
 * Renders a table showing all the recorded failover events (serving, mirroring, etc.).
 *
 * @param failover latest failover events to be rendered
 */
export const LatestEventsTable = ({ failover }: LatestEventsTableProps): ReactNode => {

  const { t } = useTranslation();
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {

      if (initialized.current) {
        return;
      }

      initialized.current = true;

      const data = {
        columns: [
          { label: t("system.failover.events.label.created-at"), field: "created", sort: true },
          { label: t("system.failover.events.label.transitioned-to"), field: "status" },
          { label: t("system.failover.events.label.parameters"), field: "parameter" },
        ],
        rows: failover.statusEntryList
          .sort((left, right) => right.created.localeCompare(left.created))
          .map(entry => { return {
            ...entry,
            created: dateFormatter(entry.created),
            status: t(`system.failover.label.status.${entry.status}`)
          }})
      }

      const { Datatable } = await import("tw-elements");
      const instance = new Datatable(document.getElementById("events-datatable"), data);
      document.getElementById("events-search-input")?.addEventListener("input", (event) => {
        instance.search((event.target as HTMLInputElement)?.value);
      });
    };
    init();
  }, []);

  return (
    <>
      <div className="mb-3">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            id="events-search-input"
            type="search"
            className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder={t("system.failover.events.label.search")}
            aria-label={t("system.failover.events.label.search")}
            aria-describedby="button-addon1" />
        </div>
      </div>
      <div id="events-datatable"></div>
    </>
  )
}
