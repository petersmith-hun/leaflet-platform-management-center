import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { PageContext } from "@/pages/_app";
import { ReactNode, useContext, useEffect } from "react";

/**
 * Types of the toast notification.
 */
export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR
}

/**
 * Toast notification properties.
 */
export interface ToastProperties {

  /**
   * Type of the toast notification.
   */
  type: ToastType;

  /**
   * Title of the toast.
   */
  title: string;

  /**
   * Message or messages to be shown within the toast.
   */
  message: string | string[];
}

const SuccessIcon = (): ReactNode => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd" />
    </svg>
  )
}

const WarningIcon = (): ReactNode => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd" />
    </svg>
  )
}

const ErrorIcon = (): ReactNode => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
            clipRule="evenodd" />
    </svg>
  )
}

const CloseButton = (): ReactNode => {

  const { triggerToast } = useContext(PageContext);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
         className="h-6 w-6" onClick={() => triggerToast(null)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const iconMap = {
  [ToastType.SUCCESS]: <SuccessIcon />,
  [ToastType.WARNING]: <WarningIcon />,
  [ToastType.ERROR]: <ErrorIcon />
}

const colorMap = {
  [ToastType.SUCCESS]: "bg-success-100 text-success-700",
  [ToastType.WARNING]: "bg-warning-100 text-warning-700",
  [ToastType.ERROR]: "bg-danger-100 text-danger-700"
}

/**
 * Renders a TW-Elements Toast notification for a finished API operation.
 *
 * @param type type of the toast notification.
 * @param title title of the toast
 * @param message message or messages to be shown within the toast
 */
export const OperationResultToast = ({ type, title, message }: ToastProperties): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Toast], false));
  }, []);

  return (
    <div className="fixed top-2 right-2">
      <div
        className={`${colorMap[type]} pointer-events-auto mx-auto mb-4 hidden w-96 max-w-full rounded-lg bg-clip-padding text-sm shadow-lg shadow-black/5 data-[te-toast-show]:block data-[te-toast-hide]:hidden`}
        id="operation-result-toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-te-autohide="true"
        data-te-toast-init=""
        data-te-toast-show="">
        <div className="flex items-center justify-between rounded-t-lg border-b-2 border-neutral/20 bg-clip-padding px-4 pb-2 pt-2.5">
          <p className="flex items-center font-bold">
            <span className="mr-2 h-4 w-4">{iconMap[type]}</span>
            {title}
          </p>
          <div className="flex items-center">
            <button
              type="button"
              className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              data-te-toast-dismiss=""
              aria-label="Close">
              <span
                className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
                <CloseButton />
              </span>
            </button>
          </div>
        </div>
        <div className="break-words rounded-b-lg px-4 py-4 ">
          <ul>
            {(Array.isArray(message) ? message : [message]).map((item, index) =>
              <li key={`message-item-${index}`}>{item}</li>)
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
