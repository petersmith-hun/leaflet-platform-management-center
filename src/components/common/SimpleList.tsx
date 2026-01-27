import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type IdentifiedItem = { id: string };

interface SimpleListProps<T extends IdentifiedItem> {
  items?: T[];
  itemTemplate: (item: T) => ReactNode;
}

/**
 * Renders a simple list components for the given items as an unordered list. If the given item list is empty or null,
 * renders a corresponding warning message.
 *
 * @param items list of items to be rendered
 * @param itemTemplate template (React component) to render a single item
 */
export const SimpleList = <T extends IdentifiedItem>({ items, itemTemplate }: SimpleListProps<T>): ReactNode => {

  const { t } = useTranslation();

  if (!(items && items.length)) {
    return <p className="ml-3"><FontAwesomeIcon icon={faWarning} /> {t("common.label.none")}</p>;
  }

  return (
    <ul className="w-[90%] ml-3 text-surface dark:text-white">
      {items.map((item, index) => (
        <li className={`${index != items.length - 1 ? "border-b-2" : ""} w-full border-neutral-100 pl-3 py-2 dark:border-gray-500`} key={item.id}>{itemTemplate(item)}</li>
      ))}
    </ul>
  )
}
