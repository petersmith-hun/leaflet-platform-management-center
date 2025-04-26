import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { SecretCreationRequest } from "@/core/model/secrets";
import { secretService } from "@/core/service/secret-service";
import { faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const secretKeyPattern = /^[a-zA-Z][a-zA-Z0-9_.:\-]*$/;
const contextPattern = /^[a-zA-Z0-9]+$/;

interface SecretComposerScreenProps {
  environment: APIEnvironment;
}

/**
 * Screen used by Domino Secret Manager's create operation.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const SecretComposerScreen = ({ environment }: SecretComposerScreenProps): ReactNode => {

  const { createSecret } = secretService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<SecretCreationRequest>();

  return (
    <SubmitOperation domain={"secret"} titleSupplier={secret => secret.key}
                     handleSubmit={handleSubmit}
                     serviceCall={async entity => {
                       await createSecret(entity);
                       return { id: entity.key };
                     }}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={t("page.title.system.secret.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("key", {
                  required: t("forms:validation.common.required"),
                  pattern: { value: secretKeyPattern, message: t("forms:validation.secret.key-pattern") }
                })}
                       label={t("forms:secret.edit.key")} id={"secret-key"}
                       errorSupplier={() => errors.key?.message} />
              </WideDataCell>
              <WideDataCell>
                <Input registerReturn={register("context", {
                  required: t("forms:validation.common.required"),
                  pattern: { value: contextPattern, message: t("forms:validation.secret.context-pattern") }
                })}
                       label={t("forms:secret.edit.context")} id={"secret-context"}
                       errorSupplier={() => errors.context?.message} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <FullWidthDataCell>
                <Input registerReturn={register("value", { required: t("forms:validation.common.required") })}
                       label={t("forms:secret.edit.value")} id={"secret-value"} password={true}
                       errorSupplier={() => errors.value?.message} />
              </FullWidthDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.secret")}>
            <PageOperationButton label={t("page-operations.secret.back-to-dsm")} icon={faList}
                                 link={"/system/secrets"} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
