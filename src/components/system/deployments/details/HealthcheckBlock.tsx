import { DataRow, ThirdWidthDataCell, TwoThirdWidthDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { OptionalDeploymentHealthcheck } from "@/core/model/domino";
import ms from "ms";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface HealthcheckBlockProps {
  healthcheck: OptionalDeploymentHealthcheck;
}

/**
 * Display block rendering healthcheck configuration information of deployments.
 *
 * @param healthcheck healthcheck information to be displayed
 */
export const HealthcheckBlock = ({ healthcheck }: HealthcheckBlockProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <DataRow>
        <ThirdWidthDataCell title={t("forms:deployment.edit.healthcheck-enabled")}>
          <ItemEnabledStatusFlag item={healthcheck} />
        </ThirdWidthDataCell>
        {healthcheck.enabled && (
          <TwoThirdWidthDataCell title={t("forms:deployment.edit.healthcheck-endpoint")}
                                 children={healthcheck.endpoint} />
        )}
      </DataRow>
      {healthcheck.enabled && (
        <DataRow>
          <ThirdWidthDataCell title={t("forms:deployment.edit.healthcheck-delay")}
                              children={ms(healthcheck.delay, { long: true })} />
          <ThirdWidthDataCell title={t("forms:deployment.edit.healthcheck-timeout")}
                              children={ms(healthcheck.timeout, { long: true })} />
          <ThirdWidthDataCell title={t("forms:deployment.edit.healthcheck-max-attempts")}
                              children={healthcheck.maxAttempts} />
        </DataRow>
      )}
    </>
  )
}
