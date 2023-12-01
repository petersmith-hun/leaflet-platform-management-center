import { faBars, faEye, faPencil, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * TODO.
 * @param icon
 * @param label
 * @param link
 * @param style
 */
export const DropdownMenuItem = ({ icon, label, link, style = "text-neutral-700 dark:text-neutral-200" }: { icon: IconDefinition, label: string, link: string, style?: string }): ReactNode => {

  const { t } = useTranslation();

  return (
    <li>
      <Link className={`${style} block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:hover:bg-neutral-600`}
            href={link}
            data-te-dropdown-item-ref="">
        <FontAwesomeIcon className="w-4 h-4" icon={icon} /> {t(label)}
      </Link>
    </li>
  )
}

/**
 * TODO.
 * @param link
 */
export const ViewDropdownMenuItem = ({ link }: { link: string }): ReactNode => {
  return <DropdownMenuItem icon={faEye} label={"dropdown.operation.view"} link={link} />
}

/**
 * TODO.
 * @param link
 */
export const EditDropdownMenuItem = ({ link }: { link: string }): ReactNode => {
  return <DropdownMenuItem icon={faPencil} label={"dropdown.operation.edit"} link={link} />
}

/**
 * TODO.
 * @param children
 * @param idSuffix
 */
export const DropdownMenu = ({ children, id }: { children: ReactElement[], id: string }): ReactNode => {

  useEffect(() => {
    const init = async () => {
      const { Dropdown, initTE } = await import("tw-elements");
      initTE({ Dropdown });
    };
    init();
  }, []);

  return (
    <div className="relative" data-te-dropdown-ref="">
      <button
        className="flex items-center whitespace-nowrap rounded bg-neutral-50 p-3 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#fbfbfb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.3),0_4px_18px_0_rgba(251,251,251,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.3),0_4px_18px_0_rgba(251,251,251,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.3),0_4px_18px_0_rgba(251,251,251,0.2)] motion-reduce:transition-none"
        type="button"
        id={id}
        data-te-dropdown-toggle-ref=""
        aria-expanded="false"
        data-te-ripple-init=""
        data-te-ripple-color="light">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul
        className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:drop-shadow-xl dark:shadow-black/40 dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
        aria-labelledby={id}
        data-te-dropdown-menu-ref="">
        {children}
      </ul>
    </div>
  )
}
