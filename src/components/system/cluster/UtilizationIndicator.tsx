import React, { ReactNode } from "react";

interface UtilizationIndicatorProps {
  percentage: number;
}

interface ContainerCountIndicatorProps {
  stopped: number;
  total: number;
}

/**
 * Renders a utilization indicator with the given percentage.
 *
 * @param percentage percentage value, value must be between [0.0 - 100.0]
 */
export const UtilizationIndicator = ({ percentage }: UtilizationIndicatorProps): ReactNode => {

  const percent = Math.round(percentage);

  return (
    <div className="radial-progress bg-neutral-400 text-primary-content border-4 border-neutral-400"
      // @ts-ignore
         style={{ "--value": percent }}
         role="progressbar">{percent}%
    </div>
  )
}

/**
 * Renders a counter, showing the number of registered containers. Progress shows the ratio of running / total containers.
 *
 * @param stopped number of stopped containers
 * @param total total number of registered containers
 */
export const ContainerCountIndicator = ({ stopped, total }: ContainerCountIndicatorProps): ReactNode => {

  const percent = Math.round((total - stopped) / total * 100);

  return (
    <div className="radial-progress bg-neutral-400 text-primary-content border-4 border-neutral-400 text-[32px]"
      // @ts-ignore
         style={{ "--value": percent }}
         role="progressbar">{total}
    </div>
  )
}
