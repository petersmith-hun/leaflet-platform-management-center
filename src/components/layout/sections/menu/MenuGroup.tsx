import { MenuGroupData } from "@/components/layout/sections/menu/index";
import { MenuItem } from "@/components/layout/sections/menu/MenuItem";
import { SidebarRotateIcon } from "@/components/layout/sections/menu/util";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Renders a menu group item in the main menu, without the group's title.
 *
 * @param menuGroupData data of the currently rendered group, including its child menu items
 */
const SimpleMenuGroup = (menuGroupData: MenuGroupData): ReactNode => {

  return (
    <>
      {menuGroupData.menuItems.map((menuItem, index) =>
        <MenuItem key={`menuItem_${index}`} {...menuItem} />
      )}
    </>
  )
}

/**
 * Renders a menu group item in the main menu, with the group's title. Title is ran through translation before being rendered.
 *
 * @param menuGroupData data of the currently rendered group, including its child menu items
 */
const MenuGroupWithHeader = (menuGroupData: MenuGroupData): ReactNode => {

  const { t } = useTranslation("menu");

  return (
    <li className="relative">
      <a
        className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
        data-te-sidenav-link-ref="">
          <span
            className="py-4 text-[0.6rem] font-bold uppercase text-gray-600 dark:text-gray-400">{t(menuGroupData.groupKey)}</span>
        <SidebarRotateIcon />
      </a>
      <ul className="pl-3 !visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block"
          data-te-sidenav-collapse-ref="">
        {menuGroupData.menuItems.map((menuItem, index) =>
          <MenuItem key={`menuItem_${index}`} {...menuItem} />
        )}
      </ul>
    </li>
  )
}

/**
 * Renders the given menu group in the main menu. It either renders a SimpleMenuGroup (if hideGroupHeader flag is enabled),
 * or a MenuGroupWithHeader (if hideGroupHeader flag is disabled). It also checks the active user's permission set and
 * skips rendering, if it does not have the required scope.
 *
 * @param menuGroupData data of the currently rendered group, including its child menu items
 */
export const MenuGroup = (menuGroupData: MenuGroupData): ReactNode => {

  const { hasPermission } = useSessionHelper();

  if (menuGroupData.requiredScope && !hasPermission(menuGroupData.requiredScope)) {
    return null;
  }

  return menuGroupData?.hideGroupHeader ?? false
    ? <SimpleMenuGroup {...menuGroupData} />
    : <MenuGroupWithHeader {...menuGroupData} />
}
