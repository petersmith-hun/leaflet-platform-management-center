import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { Input } from "@/components/form/Input";
import { Switch } from "@/components/form/Switch";
import { Textarea } from "@/components/form/Textarea";
import { assignmentPatternValidator } from "@/components/system/deployments/composer/index";
import { DeploymentForm } from "@/core/model/domino";
import React, { ReactNode, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface InfoConfigurationTabProps {
  register: UseFormRegister<DeploymentForm>;
  errors: FieldErrors<DeploymentForm>;
  defaultState: boolean;
}

/**
 * Deployment definition tab component for Domino application info parameters.
 *
 * @param register React Hook Form register function
 * @param errors form validation errors
 * @param defaultState defines the default state of the 'enabled' switch (off for new definitions, otherwise depends on info.enabled parameter)
 */
export const InfoConfigurationTab = ({ register, errors, defaultState }: InfoConfigurationTabProps): ReactNode => {

  const [infoEnabled, setInfoEnabled] = useState<boolean>(defaultState);
  const { t } = useTranslation();

  return (
    <div>
      <DataRow>
        <FullWidthDataCell>
          <Switch registerReturn={register("info.enabled")}
                  label={t("forms:deployment.edit.info-enabled")}
                  id={"deployment-info-enabled"}
                  onClick={(event) => setInfoEnabled((event.target as HTMLInputElement).checked)} />
        </FullWidthDataCell>
      </DataRow>
      {infoEnabled ? (
        <>
          <DataRow>
            <FullWidthDataCell>
              <Input registerReturn={register("info.endpoint", { required: t("forms:validation.common.required") })}
                     label={t("forms:deployment.edit.info-endpoint")} id={"deployment-info-endpoint"}
                     errorSupplier={() => errors.info?.endpoint?.message} />
            </FullWidthDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell>
              <Textarea registerReturn={register("info.fieldMapping", {
                required: t("forms:validation.common.required"),
                validate: value => assignmentPatternValidator(value) || t("forms:validation.deployments.assignment-pattern")
              })}
                        label={t("forms:deployment.edit.info-field-mapping")} id={"deployment-info-field-mapping"}
                        additionalClass="code"
                        errorSupplier={() => errors.info?.fieldMapping?.message} />
            </WideDataCell>
          </DataRow>
        </>
      ) : null}
    </div>
  )
}
