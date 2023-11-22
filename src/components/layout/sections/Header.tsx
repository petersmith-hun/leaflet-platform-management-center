import applicationConfig from "@/application-config";
import { UserMenuData } from "@/components/layout/sections/menu";
import { MobileMenu } from "@/components/layout/sections/MobileMenu";
import { UserInfo } from "@/core/domain/auth";
import { PageContext } from "@/pages/_app";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from "next-auth/react";
import React, { Fragment, ReactNode, useContext } from 'react'
import { useTranslation } from "react-i18next";

const userMenuData: UserMenuData[] = [
  { name: 'user.sign_out', path: '#', clickHandler: () => signOut() },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

interface HeaderData {
  userInfo: UserInfo;
}

/**
 * Renders the "brand" segment of the header.
 * @constructor
 */
const Brand = (): ReactNode => {

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 leaflet-logo">
        <svg id="leaflet-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 148.18836 171.18995">
          <path
            d="M212.87009,107.76641l1.95236.001-.00862,76.72232-5.8638,3.38546-3.90471-.002.00637-75.59283Zm-24.74134,14.28442-.00638,75.59283,3.90472.002,5.8638-3.38547.00861-76.72232-1.95235-.001Zm-16.92295,9.77046-.00637,75.59283,3.90472.002,5.8638-3.38547.00861-76.72232-1.95236-.001Zm-16.92294,9.77047-.00637,75.59283,3.90471.002,5.8638-3.38546.00862-76.72232-1.95236-.001Zm-16.92295,9.77047-.00553,74.14825,2.50292,1.44312,1.401.00346,5.8638-3.38547.00861-76.72232-1.95236-.001Zm-16.88909,9.75092.4007,54.881,5.1468,2.97409,4.65108-.034-.4594-62.34966-1.92078.01462Zm-16.98218,9.80466-.18378,34.93353,7.1285,4.12019,2.62257.00893.23016-43.56845-1.97905-.00815Zm-16.906,9.7607-.04614,15.49421,7.44071,4.28968,2.30749.01032.07358-24.2987-1.9657-.00458ZM73.1458,188.43626,76.43365,190.34l2.58.24786.40553-4.18283-2.35573-.23067ZM71,174l1.42188-73.19922,68.14941-39.3457,66.47949,37.8291-66.56933,38.43359L100,118l-3.39648-.54492L140.501,142.3252l74.59277-43.06641-74.53613-42.415L69.417,97.917l-1.00488.58106.36328,81.78222Z"
            transform="translate(-67.91083 -56.26744)" fill="#009c43" />
        </svg>
      </div>
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4">
          <h1>{applicationConfig.info.applicationName}</h1>
        </div>
      </div>
    </div>
  )
}

/**
 * Renders the user information and its control menu.
 *
 * @param userInfo information about the active user
 */
const UserMenu = ({ userInfo }: HeaderData): ReactNode => {

  const { t } = useTranslation("menu");

  return (
    <div className="hidden md:block">
      <div className="ml-4 flex items-center md:ml-6">
        <p style={{ lineHeight: "1.0" }}>
          <span className="pb-0 mb-0 text-base font-medium leading-none text-white">{userInfo.name}</span>
          <br />
          <span className="pt-0 mt-0 text-sm font-medium leading-none text-gray-400">{userInfo.email}</span>
        </p>
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button
              className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Open user menu</span>
              <UserIcon className="block h-6 w-6" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userMenuData.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a onClick={item.clickHandler}
                       href={item.path}
                       className={classNames(
                         active ? 'bg-gray-100' : '',
                         'block px-4 py-2 text-sm text-gray-700'
                       )}
                    >
                      {t(item.name)}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

/**
 * Renders the mobile menu button.
 */
const MobileMenuButton = ({ open }: { open: boolean }): ReactNode => {

  return (
    <div className="-mr-2 flex md:hidden">
      <Disclosure.Button
        className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open main menu</span>
        {open ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </Disclosure.Button>
    </div>
  )
}

/**
 * Default layout header. Show the active user and its control menu, as well as the current screen's title.
 *
 * @param userInfo information about the active user
 */
export const Header = ({ userInfo }: HeaderData): ReactNode => {

  const pageContext = useContext(PageContext);

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Brand />
                <UserMenu userInfo={userInfo} />
                <MobileMenuButton open={open} />
              </div>
            </div>
            <MobileMenu userMenuData={userMenuData} userInfo={userInfo} />
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow">
        <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pageContext.pageTitle}</h1>
        </div>
      </header>
    </>
  )
}
