import { MenuItemData } from "@/components/layout/sections/menu/index";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Renders the given menu item in the main menu. Menu item title is ran through translation before being rendered.
 *
 * @param menuItemData data of the currently rendered menu item
 */
export const MenuItem = (menuItemData: MenuItemData): ReactNode => {

  const { hasPermission } = useSessionHelper();
  const { t } = useTranslation("menu");

  if (menuItemData.requiredScope && !hasPermission(menuItemData.requiredScope)) {
    return null;
  }

  return (
    <li className="relative">
      <Link href={menuItemData.path}
            className="flex cursor-pointer items-center truncate rounded-[5px] px-6 py-[0.45rem] text-[0.85rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
            data-te-sidenav-link-ref>
            <span className="mr-4 w-2">
              <FontAwesomeIcon icon={menuItemData.icon ?? faGear} />
            </span>
        <span>{t(menuItemData.itemKey)}</span>
      </Link>
    </li>
  )
}
