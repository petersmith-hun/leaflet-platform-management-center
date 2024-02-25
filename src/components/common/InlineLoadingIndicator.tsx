import { SimpleCard } from "@/components/common/Cards";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface SimpleLoadingIndicatorProps {
  sizeOverride?: number;
}

/**
 * Shows a loading indicator without any wrapping.
 */
export const SimpleLoadingIndicator = ({ sizeOverride = 8 }: SimpleLoadingIndicatorProps ): ReactNode => {

  return (
    <div
      className={`inline-block h-${sizeOverride} w-${sizeOverride} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-primary`}
      role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  )
}

/**
 * Shows a loading indicator wrapped in a card.
 */
export const InlineLoadingIndicator = (): ReactNode => {

  const { t } = useTranslation();

  return (
  <SimpleCard>
    <div className="p-6 text-center">
      <SimpleLoadingIndicator />
      <br />
      <span className="ml-2 text-primary">{t('common.loading')}</span>
    </div>
  </SimpleCard>
  )
}
