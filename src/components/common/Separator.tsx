import { ReactNode } from "react";

/**
 * TODO.
 *
 * @constructor
 */
export const Separator = ({ thick = true }: { thick?: boolean }): ReactNode => {

  return <hr
    className={`${thick ? "my-12" : "my-5"} h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100`} />;
}
