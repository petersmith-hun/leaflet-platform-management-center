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
    <div className="daisy-radial-progress border-4 border-neutral-700 text-neutral-300"
      // @ts-ignore
         style={{ "--value": percent, boxShadow: "0px 0px 0px 8px rgb(82, 82, 82) inset" }}
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
    <div className="daisy-radial-progress border-4 border-neutral-700 text-neutral-300 text-[28px]"
      // @ts-ignore
         style={{ "--value": percent, boxShadow: "0px 0px 0px 8px rgb(82, 82, 82) inset" }}
         role="progressbar">{total}
    </div>
  )
}
