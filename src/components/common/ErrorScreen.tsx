import { Separator } from "@/components/common/Separator";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

const WarningIcon = ({ colorClass }: { colorClass: string }): ReactNode => {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`h-80 w-80 m-auto ${colorClass}`}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

const errorMessageMap: Record<number, string> = {
  401: "error.unauthenticated",
  403: "error.unauthorized",
  404: "error.not-found"
}

interface ErrorParameter {
  response: {
    status: number
  }
}

// TODO 401 is acting weird, check it later

/**
 * TODO.
 */
export const ErrorScreen = ({ response }: ErrorParameter): ReactNode => {

  const { t } = useTranslation();

  const warningIcon = (response?.status < 500 ?? false)
    ? <WarningIcon colorClass={"text-warning"} />
    : <WarningIcon colorClass={"text-danger"} />;

  return (
    <div
      className="block w-full rounded-lg bg-white text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <div className="p-6">
        {warningIcon}
        <Separator />
        <p>{t(errorMessageMap[response?.status] ?? "error.unexpected-error")}</p>
      </div>
    </div>
  );
}

