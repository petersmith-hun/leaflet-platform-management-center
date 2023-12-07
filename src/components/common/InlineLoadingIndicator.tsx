import { SimpleCard } from "@/components/common/Cards";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Shows a loading indicator.
 */
export const InlineLoadingIndicator = (): ReactNode => {

  const { t } = useTranslation();

  return (
  <SimpleCard>
    <div className="p-6 text-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-primary"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
      <br />
      <span className="ml-2 text-primary">{t('common.loading')}</span>
    </div>
  </SimpleCard>
  )
}
