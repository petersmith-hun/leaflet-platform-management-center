import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { Switch } from "@/components/form/Switch";
import { Textarea } from "@/components/form/Textarea";
import { DeploymentForm, InstanceNamingStrategy, InstanceSpreadMode } from "@/core/model/domino";
import React, { ReactNode, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface TargetConfigurationTabProps {
  register: UseFormRegister<DeploymentForm>;
  errors: FieldErrors<DeploymentForm>;
  defaultState: boolean;
}

/**
 * Deployment definition tab component for Domino deployment target parameters.
 *
 * @param register React Hook Form register function
 * @param errors form validation errors
 * @param defaultState defines the default state of the 'enabled' switch (off for new definitions, otherwise depends on target.multi-instance.enabled parameter)
 */
export const TargetConfigurationTab = ({ register, errors, defaultState }: TargetConfigurationTabProps): ReactNode => {

  const { t } = useTranslation();
  const [multiInstance, setMultiInstance] = useState<boolean>(defaultState);

  return (
    <div>
      <DataRow>
        <WideDataCell>
          <Textarea registerReturn={register("target.hosts", { required: t("forms:validation.common.required") })}
                    label={t("forms:deployment.edit.target-hosts")} id={"deployment-target-hosts"}
                    additionalClass="code"
                    errorSupplier={() => errors.target?.hosts?.message} />
        </WideDataCell>
        <WideDataCell>
          <Switch registerReturn={register("target.multiInstance.enabled")}
                  label={t("forms:deployment.edit.multi-instance.enabled")} id={"deployment-multi-instance-enabled"}
                  onClick={(event) => setMultiInstance((event.target as HTMLInputElement).checked)} />
        </WideDataCell>
      </DataRow>
      {multiInstance && (
        <>
          <DataRow>
            <WideDataCell>
              <Input registerReturn={register("target.multiInstance.instanceCount")}
                     label={t("forms:deployment.edit.multi-instance.instance-count")}
                     id={"deployment-multi-instance-instance-count"} forceNumber={true} />
            </WideDataCell>
            <WideDataCell>
              <Select registerReturn={register("target.multiInstance.spreadMode")}
                      label={t("forms:deployment.edit.multi-instance.spread-mode")}
                      optionMap={{
                        [InstanceSpreadMode.REPLICATE]: t("forms:deployment.edit.multi-instance.spread-mode.replicate"),
                        [InstanceSpreadMode.ONE_PER_HOST]: t("forms:deployment.edit.multi-instance.spread-mode.one-per-host")
                      }} />
            </WideDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell>
              <Select registerReturn={register("target.multiInstance.namingStrategy")}
                      label={t("forms:deployment.edit.multi-instance.naming-strategy")}
                      optionMap={{
                        [InstanceNamingStrategy.INCREMENTAL_SUFFIX]: t("forms:deployment.edit.multi-instance.naming-strategy.incremental-suffix"),
                        [InstanceNamingStrategy.CUSTOM_PREDEFINED]: t("forms:deployment.edit.multi-instance.naming-strategy.custom-predefined")
                      }} />
            </WideDataCell>
            <WideDataCell>
              <Textarea registerReturn={register("target.multiInstance.definedNames")}
                        label={t("forms:deployment.edit.multi-instance.defined-names")}
                        id={"deployment-multi-instance-defined-names"}
                        additionalClass="code" />
            </WideDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell>
              <Input registerReturn={register("target.multiInstance.portOffset")}
                     label={t("forms:deployment.edit.multi-instance.port-offset")}
                     id={"deployment-multi-instance-port-offset"} forceNumber={true} />
            </WideDataCell>
            <WideDataCell>
              <Input registerReturn={register("target.multiInstance.hostNetworkBasePort")}
                     label={t("forms:deployment.edit.multi-instance.host-network-base-port")}
                     id={"deployment-multi-instance-host-network-base-port"} forceNumber={true} />
            </WideDataCell>
          </DataRow>
        </>
      )}
    </div>
  )
}
