import { UserMenuData } from "@/components/layout/sections/menu";
import { mainMenu } from "@/components/layout/sections/menu/structure";
import { UserInfo } from "@/core/domain/auth";
import { Disclosure } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface MobileMenuData {
  userMenuData: UserMenuData[];
  userInfo: UserInfo;
}

/**
 * Renders the mobile version of the main menu.
 *
 * @param userMenuData menu structure information (same as what the main menu is using)
 * @param userInfo information about the active user
 */
export const MobileMenu = ({ userMenuData, userInfo }: MobileMenuData): ReactNode => {

  const { t } = useTranslation("menu");

  return (
    <Disclosure.Panel className="lg:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        {mainMenu.map(group => (
          <React.Fragment key={`group_${group.groupKey}`}>
            {group.hideGroupHeader || <span
							className="py-4 text-[0.6rem] font-bold uppercase text-gray-600 dark:text-gray-400">{t(group.groupKey)}</span>}
            {group.menuItems.map((item) => (
              <Disclosure.Button
                key={item.itemKey}
                as="a"
                href={item.path}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                {t(item.itemKey)}
              </Disclosure.Button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="border-t border-gray-700 pb-3 pt-4">
        <div className="flex items-center px-5">
          <div className="flex-shrink-0">
            <UserIcon className="block h-6 w-6" />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium leading-none text-white">{userInfo.name}</div>
            <div className="text-sm font-medium leading-none text-gray-400">{userInfo.email}</div>
          </div>
        </div>
        <div className="mt-3 space-y-1 px-2">
          {userMenuData.map((item) => (
            <Disclosure.Button
              onClick={item.clickHandler}
              key={item.name}
              as="a"
              href={item.path}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              {t(item.name)}
            </Disclosure.Button>
          ))}
        </div>
      </div>
    </Disclosure.Panel>
  )
}