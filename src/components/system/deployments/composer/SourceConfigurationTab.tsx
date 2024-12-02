import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { deploymentIDPattern } from "@/components/system/deployments/composer/index";
import { DeploymentForm, SourceType } from "@/core/model/domino";
import React, { ReactNode } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface SourceConfigurationTabProps {
  register: UseFormRegister<DeploymentForm>;
  errors: FieldErrors<DeploymentForm>;
  setSelectedSourceType: (sourceType: string) => void;
}

/**
 * Deployment definition tab component for Domino deployment source parameters.
 *
 * @param register React Hook Form register function
 * @param errors form validation errors
 * @param setSelectedSourceType local state setter function to distribute selected source type for other tabs
 */
export const SourceConfigurationTab = ({ register, errors, setSelectedSourceType }: SourceConfigurationTabProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <div>
      <DataRow>
        <WideDataCell>
          <Input registerReturn={register("id", {
            required: t("forms:validation.common.required"),
            pattern: { value: deploymentIDPattern, message: t("forms:validation.deployments.id-pattern") }
          })}
                 label={t("forms:deployment.edit.id")} id={"deployment-id"}
                 errorSupplier={() => errors.id?.message} />
        </WideDataCell>
        <WideDataCell>
          <Select onChange={(event) => setSelectedSourceType(event.target.value)}
                  registerReturn={register("source.type")} label={t("forms:deployment.edit.source-type")}
                  optionMap={{
                    [SourceType.DOCKER]: t("system.deployments.label.source.docker"),
                    [SourceType.FILESYSTEM]: t("system.deployments.label.source.filesystem")
                  }} />
        </WideDataCell>
      </DataRow>
      <DataRow>
        <WideDataCell>
          <Input registerReturn={register("source.home", { required: t("forms:validation.common.required") })}
                 label={t("forms:deployment.edit.source-home")} id={"deployment-source-home"}
                 errorSupplier={() => errors.source?.home?.message} />
        </WideDataCell>
        <WideDataCell>
          <Input registerReturn={register("source.resource", { required: t("forms:validation.common.required") })}
                 label={t("forms:deployment.edit.source-resource")} id={"deployment-source-resource"}
                 errorSupplier={() => errors.source?.resource?.message} />
        </WideDataCell>
      </DataRow>
    </div>
  )
}
