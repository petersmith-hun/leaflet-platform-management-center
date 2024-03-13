import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { LoggingEvent } from "@/core/model/logs";
import { dateFormatter } from "@/core/util/date-formatter";
import { ReactNode, useEffect } from "react";

interface LogEventCardProps {
  log: LoggingEvent;
  id: string;
}

const borderColorMap = new Map<string, string>([
  ["info", "border-info"],
  ["warn", "border-warning"],
  ["error", "border-danger"],
]);

const getBorderColorClass = (log: LoggingEvent): string => {
  return borderColorMap.get(log.level.toLowerCase()) ?? "border-neutral";
}

const ExceptionAccordion = ({ log, id }: { log: LoggingEvent, id: string }): ReactNode => {

  return (
    <div id={`box-exception-accordion-${id}`}>
      <div className="border border-neutral-200 dark:border-neutral-600 dark:bg-neutral-800">
        <h2 className="mb-0" id={`heading-exception-accordion-${id}`}>
          <button
            className="code group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-2 py-1 text-left text-xs text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white"
            type="button"
            data-te-collapse-init=""
            data-te-collapse-collapsed=""
            data-te-target={`#exception-accordion-${id}`}
            aria-expanded="false"
            aria-controls={`exception-accordion-${id}`}>
            {log.exception?.className}: {log.exception?.message}
            <span
              className="ml-auto h-3 w-3 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:rotate-0 motion-reduce:transition-none dark:fill-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-3 w-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>
        </h2>
        <div
          id={`exception-accordion-${id}`}
          className="!visible hidden"
          data-te-collapse-item=""
          aria-labelledby={`heading-exception-accordion-${id}`}
          data-te-parent={`#box-exception-accordion-${id}`}>
          <div className="px-2 py-2 code text-xs">
            {log.exception?.stackTrace}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Renders a log event card, containing the contents of the given log message.
 *
 * @param log log event to be rendered
 * @param id id to be attached to each log message
 */
export const LogEventCard = ({ log, id }: LogEventCardProps): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Collapse]));
  }, []);

  return (
    <div
      className={`border-2 ${getBorderColorClass(log)} rounded-lg bg-white py-2 px-6 mb-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-lg dark:bg-neutral-700`}>
      <div className="text-xs text-neutral-300 flex flex-row">
        <div className="w-1/12 font-bold">{log.level}</div>
        <div className="w-1/12">{log.source}</div>
        <div className="w-2/12">{dateFormatter(log.timeStamp)}</div>
        <div className="w-3/12">{log.threadName}</div>
        <div className="w-5/12">{log.loggerName}</div>
      </div>
      <div className="text-xs text-neutral-300 flex flex-row">
        {Object.keys(log.context).map(key =>
          <div className="pr-3" key={`context-${id}-${key}`}>
            <span className="font-semibold pr-2">{key}:</span>
            <span>{log.context[key]}</span>
          </div>
        )}
      </div>
      <p className="mt-1 text-neutral break-words">{log.content}</p>
      {log.exception && <ExceptionAccordion log={log} id={id} />}
    </div>
  )
}
