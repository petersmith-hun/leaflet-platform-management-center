import { DataRow, FullWidthDataCell, ThirdWidthDataCell } from "@/components/common/DataRow";
import { Input } from "@/components/form/Input";
import { Switch } from "@/components/form/Switch";
import { DeploymentForm, DeploymentHealthcheck } from "@/core/model/domino";
import React, { ReactNode, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface HealthcheckConfigurationTabProps {
  register: UseFormRegister<DeploymentForm>;
  errors: FieldErrors<DeploymentForm>;
  defaultState: boolean;
}

/**
 * Deployment definition tab component for Domino deployment healthcheck parameters.
 *
 * @param register React Hook Form register function
 * @param errors form validation errors
 * @param defaultState defines the default state of the 'enabled' switch (off for new definitions, otherwise depends on health-check.enabled parameter)
 */
export const HealthcheckConfigurationTab = ({ register, errors, defaultState }: HealthcheckConfigurationTabProps): ReactNode => {

  const [healthcheckEnabled, setHealthcheckEnabled] = useState<boolean>(defaultState);
  const { t } = useTranslation();

  return (
    <div>
      <DataRow>
        <FullWidthDataCell>
          <Switch registerReturn={register("healthcheck.enabled")}
                  label={t("forms:deployment.edit.healthcheck-enabled")}
                  id={"deployment-healthcheck-enabled"}
                  onClick={(event) => setHealthcheckEnabled((event.target as HTMLInputElement).checked)} />
        </FullWidthDataCell>
      </DataRow>
      {healthcheckEnabled ? (
        <>
          <DataRow>
            <FullWidthDataCell>
              <Input
                registerReturn={register("healthcheck.endpoint", { required: t("forms:validation.common.required") })}
                label={t("forms:deployment.edit.healthcheck-endpoint")} id={"deployment-healthcheck-endpoint"}
                errorSupplier={() => (errors.healthcheck as FieldErrors<DeploymentHealthcheck>)?.endpoint?.message} />
            </FullWidthDataCell>
          </DataRow>
          <DataRow>
            <ThirdWidthDataCell>
              <Input registerReturn={register("healthcheck.delay", { required: t("forms:validation.common.required") })}
                     label={t("forms:deployment.edit.healthcheck-delay")} id={"deployment-healthcheck-delay"}
                     errorSupplier={() => (errors.healthcheck as FieldErrors<DeploymentHealthcheck>)?.delay?.message} />
            </ThirdWidthDataCell>
            <ThirdWidthDataCell>
              <Input
                registerReturn={register("healthcheck.timeout", { required: t("forms:validation.common.required") })}
                label={t("forms:deployment.edit.healthcheck-timeout")} id={"deployment-healthcheck-timeout"}
                errorSupplier={() => (errors.healthcheck as FieldErrors<DeploymentHealthcheck>)?.timeout?.message} />
            </ThirdWidthDataCell>
            <ThirdWidthDataCell>
              <Input
                registerReturn={register("healthcheck.maxAttempts", { required: t("forms:validation.common.required") })}
                label={t("forms:deployment.edit.healthcheck-max-attempts")} id={"deployment-healthcheck-max-attempts"}
                errorSupplier={() => (errors.healthcheck as FieldErrors<DeploymentHealthcheck>)?.maxAttempts?.message} />
            </ThirdWidthDataCell>
          </DataRow>
        </>
      ) : null}
    </div>
  )
}
