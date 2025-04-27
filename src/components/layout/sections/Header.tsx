import applicationInfo from "@/application-info";
import { LeafletLogo } from "@/components/common/LeafletLogo";
import { UserMenuData } from "@/components/layout/sections/menu";
import { MobileMenu } from "@/components/layout/sections/MobileMenu";
import { UserInfo } from "@/core/domain/auth";
import { PageContext } from "@/pages/_app";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { Fragment, ReactNode, useContext } from 'react'
import { useTranslation } from "react-i18next";

const userMenuData: UserMenuData[] = [
  { name: "user.account.update-profile", path: "/account/update-profile" },
  { name: "user.account.change-password", path: "/account/change-password" },
  { name: "user.sign_out", path: "#", clickHandler: () => signOut() }
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
      <LeafletLogo />
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4">
          <h1>{applicationInfo.applicationName}</h1>
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
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userMenuData.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link onClick={item.clickHandler}
                       href={item.path}
                       className={classNames(
                         active ? 'bg-gray-100' : '',
                         'block px-4 py-2 text-sm text-gray-700'
                       )}>
                      {t(item.name)}
                    </Link>
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
    <div className="-mr-2 flex lg:hidden">
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
        <div className="mx-auto max-w-full px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pageContext.pageTitle}</h1>
        </div>
      </header>
    </>
  )
}
