import { DataRow, FullWidthDataCell, ThirdWidthDataCell, TwoThirdWidthDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { TableArgument } from "@/components/system/deployments/details/common";
import { OptionalDeploymentInfo } from "@/core/model/domino";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface InfoBlockProps {
  info: OptionalDeploymentInfo;
}

/**
 * Display block rendering info endpoint configuration information of deployments.
 *
 * @param info info endpoint configuration to be displayed
 */
export const InfoBlock = ({ info }: InfoBlockProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <DataRow>
        <ThirdWidthDataCell title={t("forms:deployment.edit.info-enabled")}>
          <ItemEnabledStatusFlag item={info} />
        </ThirdWidthDataCell>
        {info.enabled && (
          <TwoThirdWidthDataCell title={t("forms:deployment.edit.info-endpoint")} children={info.endpoint} />
        )}
      </DataRow>
      {info.enabled && (
        <DataRow>
          <FullWidthDataCell title={t("forms:deployment.edit.info-field-mapping")}>
            <TableArgument leftColumnNameKey={"system.deployments.label.target-key"}
                           rightColumnNameKey={"system.deployments.label.jsonpath"}
                           tableContent={info.fieldMapping as {}} />
          </FullWidthDataCell>
        </DataRow>
      )}
    </>
  )
}
