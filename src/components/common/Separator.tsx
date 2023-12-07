import { ReactNode } from "react";

interface SeparatorProps {
  thick?: boolean;
}

/**
 * Renders a TW-Elements Separator (horizontal ruler) component.
 *
 * @param thick controls the padding above and below the ruler (thick = my-12, thin = my-5)
 */
export const Separator = ({ thick = true }: SeparatorProps): ReactNode => {

  return <hr
    className={`${thick ? "my-12" : "my-5"} h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100`} />;
}
