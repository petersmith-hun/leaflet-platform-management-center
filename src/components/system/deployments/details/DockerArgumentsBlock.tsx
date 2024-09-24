import { DataRow, FullWidthDataCell, ThirdWidthDataCell, TwoThirdWidthDataCell } from "@/components/common/DataRow";
import { ArrayArgument, TableArgument } from "@/components/system/deployments/details/common";
import { DockerArguments } from "@/core/model/domino";
import React from "react";
import { useTranslation } from "react-i18next";

interface DockerArgumentsBlockProps {
  dockerArgs?: DockerArguments;
}

/**
 * Display block rendering Docker execution arguments of Docker based deployments.
 *
 * @param dockerArgs Docker execution arguments to be displayed
 */
export const DockerArgumentsBlock = ({ dockerArgs }: DockerArgumentsBlockProps) => {

  const { t } = useTranslation();
  const notApplicable = t("system.deployments.label.not-applicable");

  if (!dockerArgs) {
    return notApplicable;
  }

  return (
    <>
      <DataRow>
        <ThirdWidthDataCell title={t("forms:deployment.edit.execution-args-command-args")}>
          <ArrayArgument items={dockerArgs.commandArgs ?? []} />
        </ThirdWidthDataCell>
        <ThirdWidthDataCell title={t("forms:deployment.edit.execution-args-restart-policy")}
                            children={dockerArgs.restartPolicy ?? notApplicable} />
        <ThirdWidthDataCell title={t("forms:deployment.edit.execution-args-network-mode")}
                            children={dockerArgs.networkMode ?? notApplicable} />
      </DataRow>
      <DataRow>
        <TwoThirdWidthDataCell title={t("forms:deployment.edit.execution-args-volumes")}>
          <TableArgument leftColumnNameKey="system.deployments.label.host-path"
                         rightColumnNameKey="system.deployments.label.container-path"
                         tableContent={dockerArgs.volumes} />
        </TwoThirdWidthDataCell>
        <ThirdWidthDataCell title={t("forms:deployment.edit.execution-args-ports")}>
          <TableArgument leftColumnNameKey="system.deployments.label.host-port"
                         rightColumnNameKey="system.deployments.label.container-port"
                         tableContent={dockerArgs.ports} />
        </ThirdWidthDataCell>
      </DataRow>
      <DataRow>
        <FullWidthDataCell title={t("forms:deployment.edit.execution-args-environment")}>
          <TableArgument leftColumnNameKey="system.deployments.label.env-var-key"
                         rightColumnNameKey="system.deployments.label.env-var-value"
                         tableContent={dockerArgs.environment} />
        </FullWidthDataCell>
      </DataRow>
    </>
  )
}
