import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { Textarea } from "@/components/form/Textarea";
import { assignmentPatternValidator } from "@/components/system/deployments/composer/index";
import { DeploymentForm, DockerExecutionType, FilesystemExecutionType, SourceType } from "@/core/model/domino";
import React, { ReactNode } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ConfigurationTabProps {
  register: UseFormRegister<DeploymentForm>;
  errors: FieldErrors<DeploymentForm>;
}

interface ExecutionConfigurationTabProps extends ConfigurationTabProps {
  selectedSourceType: string;
}

/**
 * Deployment definition tab component for Domino deployment execution parameters. Depending on the selected source
 * type, either renders a Docker configuration input set, or a filesystem based one.
 *
 * @param register React Hook Form register function
 * @param errors form validation errors
 * @param selectedSourceType defines the selected deployment source type (Docker or filesystem)
 */
export const ExecutionConfigurationTab = ({ register, errors, selectedSourceType }: ExecutionConfigurationTabProps): ReactNode => {

  const { t } = useTranslation();

  const dockerExecutionOptionMap = {
    [DockerExecutionType.STANDARD]: t("system.deployments.label.execution.docker-standard")
  };

  const filesystemExecutionOptionMap = {
    [FilesystemExecutionType.EXECUTABLE]: t("system.deployments.label.execution.filesystem-executable"),
    [FilesystemExecutionType.RUNTIME]: t("system.deployments.label.execution.filesystem-runtime"),
    [FilesystemExecutionType.SERVICE]: t("system.deployments.label.execution.filesystem-service")
  }

  return (
    <div>
      <DataRow>
        <WideDataCell>
          <Select registerReturn={register("execution.via")} label={t("forms:deployment.edit.execution-via")}
                  optionMap={selectedSourceType === SourceType.FILESYSTEM
                    ? filesystemExecutionOptionMap
                    : dockerExecutionOptionMap
                  } />
        </WideDataCell>
        <WideDataCell>
          <Input registerReturn={register("execution.commandName", { required: t("forms:validation.common.required") })}
                 label={t("forms:deployment.edit.execution-command-name")} id={"deployment-execution-command-name"}
                 errorSupplier={() => errors.execution?.commandName?.message} />
        </WideDataCell>
      </DataRow>
      {selectedSourceType === SourceType.FILESYSTEM
        ? <FilesystemExecutionConfiguration register={register} errors={errors} />
        : <DockerExecutionConfiguration register={register} errors={errors} />
      }
    </div>
  )
}

const FilesystemExecutionConfiguration = ({ register, errors }: ConfigurationTabProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <DataRow>
        <WideDataCell>
          <Input registerReturn={register("execution.asUser", { required: t("forms:validation.common.required") })}
                 label={t("forms:deployment.edit.execution-user")} id={"deployment-execution-user"}
                 errorSupplier={() => errors.execution?.asUser?.message} />
        </WideDataCell>
        <WideDataCell>
          <Input registerReturn={register("execution.runtime", { required: t("forms:validation.common.required") })}
                 label={t("forms:deployment.edit.execution-runtime")} id={"deployment-execution-runtime"}
                 errorSupplier={() => errors.execution?.runtime?.message} />
        </WideDataCell>
      </DataRow>
      <DataRow>
        <WideDataCell>
          <Textarea registerReturn={register("execution.args.commandLineArgs")}
                    label={t("forms:deployment.edit.execution-args")}
                    id={"deployment-execution-args"} additionalClass="code"
                    errorSupplier={() => errors.execution?.args?.commandLineArgs?.message} />
        </WideDataCell>
      </DataRow>
    </>
  )
}

const DockerExecutionConfiguration = ({ register, errors }: ConfigurationTabProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <>
      <DataRow>
        <WideDataCell>
          <Input registerReturn={register("execution.args.networkMode")}
                 label={t("forms:deployment.edit.execution-args-network-mode")}
                 id={"deployment-execution-args-network-mode"}
                 errorSupplier={() => errors.execution?.args?.networkMode?.message} />
        </WideDataCell>
        <WideDataCell>
          <Input registerReturn={register("execution.args.restartPolicy")}
                 label={t("forms:deployment.edit.execution-args-restart-policy")}
                 id={"deployment-execution-args-restart-policy"}
                 errorSupplier={() => errors.execution?.args?.restartPolicy?.message} />
        </WideDataCell>
      </DataRow>
      <DataRow>
        <FullWidthDataCell>
          <Textarea registerReturn={register("execution.args.environment", {
            validate: value => assignmentPatternValidator(value) || t("forms:validation.deployments.assignment-pattern")
          })}
                    label={t("forms:deployment.edit.execution-args-environment")}
                    id={"deployment-execution-args-environment"} additionalClass="code"
                    errorSupplier={() => errors.execution?.args?.environment?.message} />
        </FullWidthDataCell>
      </DataRow>
      <DataRow>
        <FullWidthDataCell>
          <Textarea registerReturn={register("execution.args.volumes", {
            validate: value => assignmentPatternValidator(value) || t("forms:validation.deployments.assignment-pattern")
          })}
                    label={t("forms:deployment.edit.execution-args-volumes")}
                    id={"deployment-execution-args-volumes"} additionalClass="code"
                    errorSupplier={() => errors.execution?.args?.volumes?.message} />
        </FullWidthDataCell>
      </DataRow>
      <DataRow>
        <WideDataCell>
          <Textarea registerReturn={register("execution.args.ports", {
            validate: value => assignmentPatternValidator(value) || t("forms:validation.deployments.assignment-pattern")
          })}
                    label={t("forms:deployment.edit.execution-args-ports")}
                    id={"deployment-execution-args-ports"} additionalClass="code"
                    errorSupplier={() => errors.execution?.args?.ports?.message} />
        </WideDataCell>
        <WideDataCell>
          <Textarea registerReturn={register("execution.args.commandArgs")}
                    label={t("forms:deployment.edit.execution-args-command-args")}
                    id={"deployment-execution-args-command-args"} additionalClass="code"
                    errorSupplier={() => errors.execution?.args?.commandArgs?.message} />
        </WideDataCell>
      </DataRow>
    </>
  )
}
