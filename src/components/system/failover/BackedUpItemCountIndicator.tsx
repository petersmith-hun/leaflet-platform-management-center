import { MirrorStatus } from "@/core/model/failover";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface BackedUpItemCountIndicatorProps {
  mirrorStatus: MirrorStatus;
}

/**
 * Renders a counter, showing the number of backed up items.
 *
 * @param count number of backed up items
 */
export const BackedUpItemCountIndicator = ({ mirrorStatus }: BackedUpItemCountIndicatorProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-grow">
      <div>
        <div className="daisy-radial-progress border-4 border-neutral-700 text-neutral-300 text-[28px]"
          // @ts-ignore
             style={{ "--value": 100, boxShadow: "0px 0px 0px 8px rgb(82, 82, 82) inset" }}
             role="progressbar">{mirrorStatus.numberOfRecords}
        </div>
      </div>
      <div className="text-xs text-neutral-300 py-2">{t(`system.failover.label.count.${mirrorStatus.mirrorType}`)}</div>
    </div>
  )
}
