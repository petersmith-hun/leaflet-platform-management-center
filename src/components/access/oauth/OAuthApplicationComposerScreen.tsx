import { APIEnvironment } from "@/api-environment";
import { ClientApplicationComposer } from "@/components/access/oauth/ClientApplicationComposer";
import { mapApplicationToRequest } from "@/components/access/oauth/commons";
import { ResourceServerApplicationComposer } from "@/components/access/oauth/ResourceServerApplicationComposer";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { SelectWithHint } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { OAuthApplicationModel, OAuthApplicationRegistrationRequest, RegistrationType } from "@/core/model/oauth";
import { oauthApplicationService } from "@/core/service/oauth-applications-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import { TFunction } from "i18next";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ApplicationComposerScreenProps {
  environment: APIEnvironment;
  application?: OAuthApplicationModel;
  mutate?: KeyedMutator<OAuthApplicationModel>;
}

const createRegistrationTypeMap = (t: TFunction): Record<string, { value: string, hint: string }> => {

  const registrationTypeMapEntries = Object.keys(RegistrationType)
    .map(registrationType => [registrationType, {
      value: t(`forms:oauth-application.edit.type.${registrationType}`),
      hint: t(`forms:oauth-application.edit.type.${registrationType}.hint`)
    }]);

  return Object.fromEntries(registrationTypeMapEntries);
}

const showClientOptions = (registrationTypeWatch: RegistrationType): boolean => {

  return registrationTypeWatch == RegistrationType.CLIENT
    || registrationTypeWatch == RegistrationType.MIDDLE_RESOURCE_SERVER;
};

const showResourceServerOptions = (registrationTypeWatch: RegistrationType): boolean => {

  return registrationTypeWatch == RegistrationType.RESOURCE_SERVER
    || registrationTypeWatch == RegistrationType.MIDDLE_RESOURCE_SERVER;
}

/**
 * Screen used by OAuth application manager's create/edit operations. For editing purpose, provide the OAuth application itself,
 * as well as an SWR mutate function to invalidate the cache for the edited application.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param application application data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const OAuthApplicationComposerScreen = ({ environment, application, mutate }: ApplicationComposerScreenProps): ReactNode => {

  const defaultValues = mapApplicationToRequest(application);
  const { createApplication, editApplication } = oauthApplicationService(environment);
  const { t } = useTranslation();
  const form = useForm<OAuthApplicationRegistrationRequest>({ defaultValues });
  const router = useRouter();
  const applicationID = router.query.id as string | undefined;

  const registrationTypeWatch = form.watch("registrationType", defaultValues?.registrationType ?? RegistrationType.CLIENT);

  return (
    <SubmitOperation domain={"oauth-application"} mutate={mutate} titleSupplier={application => application.name}
                     handleSubmit={form.handleSubmit}
                     serviceCall={entity => applicationID
                       ? editApplication(applicationID, entity)
                       : createApplication(entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={application?.name ?? t("page.title.oauth-application.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={form.register("name", { required: t("forms:validation.common.required") })}
                       label={t("forms:oauth-application.edit.name")} id={"oauth-application-name"}
                       errorSupplier={() => form.formState.errors.name?.message} />
              </WideDataCell>
              <WideDataCell>
                <Input registerReturn={form.register("clientID", { required: t("forms:validation.common.required") })}
                       label={t("forms:oauth-application.edit.client-id")} id={"oauth-application-client-id"}
                       errorSupplier={() => form.formState.errors.clientID?.message} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <FullWidthDataCell>
                <SelectWithHint optionMap={createRegistrationTypeMap(t)}
                                registerReturn={form.register("registrationType", { required: t("forms:validation.common.required") })}
                                label={t("forms:oauth-application.edit.registration-type")} />
              </FullWidthDataCell>
            </DataRow>
          </CardWithTitle>
          {showClientOptions(registrationTypeWatch) && (
            <ClientApplicationComposer environment={environment} form={form} />
          )}
          {showResourceServerOptions(registrationTypeWatch) && (
            <ResourceServerApplicationComposer environment={environment} form={form} />
          )}
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.oauth-application")}>
            <PageOperationButton label={t("page-operations.oauth-application.back-to-applications")} icon={faList}
                                 link={"/access/oauth-applications"} />
            {applicationID && <PageOperationButton label={t("page-operations.oauth-application.view")} icon={faEye}
                                                   link={`/access/oauth-applications/view/${applicationID}`} />}
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
