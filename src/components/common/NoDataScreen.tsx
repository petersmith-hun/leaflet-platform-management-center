import { SimpleCard } from "@/components/common/Cards";
import { WidePane } from "@/components/common/ScreenLayout";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Screen to render when there's no data to be shown.
 */
export const NoDataScreen = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <WidePane>
      <SimpleCard>
        <p><FontAwesomeIcon icon={faWarning} /> {t("notification.common.no-data")}</p>
      </SimpleCard>
    </WidePane>
  )
}
