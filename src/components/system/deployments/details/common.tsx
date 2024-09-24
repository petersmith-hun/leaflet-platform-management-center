import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ArrayArgumentProps {
  items?: string[] | any;
}

interface TableArgumentProps {
  tableContent?: { [key: string]: string };
  leftColumnNameKey: string;
  rightColumnNameKey: string;
}

/**
 * Display block for deployment arguments of array format (e.g. target hosts, command line arguments, etc.).
 *
 * @param items items to be listed
 */
export const ArrayArgument = ({ items }: ArrayArgumentProps): ReactNode => {

  const { t } = useTranslation();
  const notApplicable = t("system.deployments.label.not-applicable");

  if (!Array.isArray(items) || !items.length) {
    return notApplicable;
  }

  return (
    <ul className="ms-6 list-disc">
      {items.map((item, index) => (
        <li key={`item-${index}`} className="code">{item}</li>
      ))}
    </ul>
  )
}

/**
 * Display block for deployment arguments of table format (e.g. volume mappings, environment variables, etc.).
 *
 * @param tableContent table content as flat object (key-value pairs)
 * @param leftColumnNameKey header key for the left column (will be translated)
 * @param rightColumnNameKey header key for the right column (will be translated)
 */
export const TableArgument = ({ tableContent, leftColumnNameKey, rightColumnNameKey }: TableArgumentProps): ReactNode => {

  const { t } = useTranslation();
  const notApplicable = t("system.deployments.label.not-applicable");

  if (!tableContent) {
    return notApplicable;
  }

  return (
    <table className="w-[99%] text-left text-sm font-light text-surface dark:text-white">
      <thead className="border-b border-neutral-200 font-bold dark:border-white/10">
      <tr>
        <th scope="col" className="px-6 py-2">{t(leftColumnNameKey)}</th>
        <th scope="col" className="px-6 py-2">{t(rightColumnNameKey)}</th>
      </tr>
      </thead>
      <tbody className="code">
      {Object.keys(tableContent).map(key => (
        <tr key={`volume-${key}`} className="border-b border-neutral-200 dark:border-white/10">
          <td className="whitespace-nowrap px-6 py-2">{key}</td>
          <td className="whitespace-break-spaces px-6 py-2">{tableContent[key]}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
