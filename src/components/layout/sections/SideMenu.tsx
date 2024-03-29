"use client";

import { MenuGroup } from "@/components/layout/sections/menu/MenuGroup";
import { mainMenu } from "@/components/layout/sections/menu/structure";
import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { ReactNode, useEffect } from "react";

/**
 * Renders the main menu.
 */
export const SideMenu = (): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Sidenav], false));
  }, []);

  return (
    <nav
      id="sidenav-main"
      className="hidden lg:block relative left-0 top-0 z-[1035] h-full w-60 -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
      data-te-sidenav-init=""
      data-te-sidenav-width={260}
      data-te-sidenav-mode="side"
      data-te-sidenav-hidden="false"
      data-te-sidenav-position="relative"
      data-te-sidenav-accordion="true">
      <ul className="relative m-0 list-none px-[0.2rem] pb-2 sidebar-height-full" data-te-sidenav-menu-ref="">
        {mainMenu.map((menuGroupData, index) =>
          <MenuGroup key={`menuGroup_${index}`} {...menuGroupData} />
        )}
      </ul>
    </nav>
  )
}
