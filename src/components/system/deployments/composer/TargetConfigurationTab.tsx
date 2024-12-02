import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { Textarea } from "@/components/form/Textarea";
import { DeploymentForm } from "@/core/model/domino";
import React, { ReactNode } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface TargetConfigurationTabProps {
  register: UseFormRegister<DeploymentForm>;
  errors: FieldErrors<DeploymentForm>;
}

/**
 * Deployment definition tab component for Domino deployment target parameters.
 *
 * @param register React Hook Form register function
 * @param errors form validation errors
 */
export const TargetConfigurationTab = ({ register, errors }: TargetConfigurationTabProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <div>
      <DataRow>
        <WideDataCell>
          <Textarea registerReturn={register("target.hosts", { required: t("forms:validation.common.required") })}
                    label={t("forms:deployment.edit.target-hosts")} id={"deployment-target-hosts"}
                    additionalClass="code"
                    errorSupplier={() => errors.target?.hosts?.message} />
        </WideDataCell>
      </DataRow>
    </div>
  )
}
