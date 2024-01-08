import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { LogEventCard } from "@/components/system/logs/LogEventCard";
import { noOpPagination } from "@/core/model/common";
import { LogEventPage, LoggingEvent } from "@/core/model/logs";
import React, { ReactNode } from "react";

interface LogEventResultsProps {
  logEventPage: LogEventPage;
}

const generateID = (log: LoggingEvent): string => {
  return `${log.source}-${new Date(log.timeStamp).getTime()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Renders the log results panel.
 *
 * @param logEventPage object containing a page of log messages
 */
export const LogEventResults = ({ logEventPage }: LogEventResultsProps): ReactNode => {

  return (
    <ItemListPane pagination={noOpPagination}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.logs.level"} widthClass={"w-1/12"} />
        <ItemListHeaderItem titleKey={"header.logs.source"} widthClass={"w-1/12"} />
        <ItemListHeaderItem titleKey={"header.logs.logged-at"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.logs.thread"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.logs.logger"} widthClass={"w-5/12"} />
      </ItemListHeader>
      <ItemListBody data={logEventPage.entitiesOnPage}>
        {(log: LoggingEvent) => {
          const id = generateID(log);
          return <LogEventCard id={id} key={`log-${id}`} log={log} />
        }}
      </ItemListBody>
    </ItemListPane>
  )
}
