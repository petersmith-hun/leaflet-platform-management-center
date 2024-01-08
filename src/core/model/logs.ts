/**
 * Exception (throwableProxy) node deserialization model that conforms Logback-original log event model format.
 */
export interface ThrowableProxyLogItem {

  className: string;
  message: string;
  stackTrace: string;
  cause: ThrowableProxyLogItem;
  suppressed: ThrowableProxyLogItem[];
}

/**
 * Domain object representing log events.
 */
export interface LoggingEvent {

  threadName: string | null;
  loggerName: string | null;
  level: string;
  content: string;
  exception: ThrowableProxyLogItem | null;
  timeStamp: string;
  source: string;
  context: Record<string, string>;
}

/**
 * List of LoggingEvent objects with paging information.
 */
export interface LogEventPage {

  entityCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  entityCountOnPage: number;
  entitiesOnPage: LoggingEvent[];
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Default empty log event page for log management screen initial state.
 */
export const emptyLogEventPage: LogEventPage = {

  entitiesOnPage: [],
  entityCount: 0,
  entityCountOnPage: 0,
  first: true,
  hasNext: false,
  hasPrevious: false,
  last: true,
  pageCount: 0,
  pageNumber: 1,
  pageSize: 0
}

/**
 * TLQL Log query request for TLP v2 API.
 */
export interface LogRequest {

  query: string;
}
