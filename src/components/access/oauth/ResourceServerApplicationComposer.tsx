import { APIEnvironment } from "@/api-environment";
import { CountManipulationButton, PermissionSelector } from "@/components/access/oauth/utils";
import { CardWithTitle } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { Input } from "@/components/form/Input";
import { OptionWithHintRecord, SelectWithHint } from "@/components/form/Select";
import { OAuthApplicationRegistrationRequest, OAuthApplicationSummaryModel } from "@/core/model/oauth";
import { PermissionModel } from "@/core/model/permission";
import { oauthApplicationService } from "@/core/service/oauth-applications-service";
import { permissionService } from "@/core/service/permissions-service";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface ResourceServerApplicationComposerProps {
  environment: APIEnvironment;
  form: UseFormReturn<OAuthApplicationRegistrationRequest>;
}

interface AllowedClientComposerProps {
  form: UseFormReturn<OAuthApplicationRegistrationRequest>;
  index: number;
  setAllowedClientsCount: Dispatch<SetStateAction<number>>;
  allApplications: OAuthApplicationSummaryModel[];
  registeredPermissions: PermissionModel[];
}

const mapApplicationsToOptions = (allApplication: OAuthApplicationSummaryModel[]): OptionWithHintRecord => {

  return Object.fromEntries(allApplication.map(application =>
    [application.id, { value: application.name, hint: application.clientID }]
  ));
}

const AllowedClientComposer = ({ form, index, setAllowedClientsCount, allApplications, registeredPermissions }: AllowedClientComposerProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <DataRow>
      <WideDataCell>
        <SelectWithHint optionMap={mapApplicationsToOptions(allApplications)} search={allApplications.length > 4}
                        registerReturn={form.register(`resourceServer.allowedClients.${index}.applicationID`)}
                        label={t("forms:oauth-application.edit.allowed-clients")} />
      </WideDataCell>
      <WideDataCell>
        <PermissionSelector permissions={registeredPermissions}
                            registerReturn={form.register(`resourceServer.allowedClients.${index}.allowedPermissions`)}
                            labelKey={"forms:oauth-application.edit.allowed-permissions"} />
      </WideDataCell>
      <CountManipulationButton increase={false} counterStateSetter={setAllowedClientsCount} callback={() => {
        const current = form.getValues("resourceServer.allowedClients");
        current?.splice(index, 1);
        form.setValue("resourceServer.allowedClients", current, { shouldDirty: true });
        form.resetField("resourceServer.allowedClients", { defaultValue: current, keepDirty: true });
      }} />
    </DataRow>
  )
}

const createAllowedClientKey = (form: UseFormReturn<OAuthApplicationRegistrationRequest>, index: number): string => {
  return `allowed-client-${index}-${form.getValues(`resourceServer.allowedClients.${index}.applicationID`)}`;
}

/**
 * OAuth application composer screen segment for defining the resource server settings of an application registration.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param form main composer form instance
 */
export const ResourceServerApplicationComposer = ({ environment, form }: ResourceServerApplicationComposerProps): ReactNode => {

  const { getAllApplications } = oauthApplicationService(environment);
  const { getAllPermissions } = permissionService(environment);
  const { isLoading: isApplicationListLoading, data: allApplications } = useSWR("allApplicationsUnpaged", () => getAllApplications());
  const { isLoading: isPermissionListLoading, data: allPermissions } = useSWR("allPermissionsUnpaged", () => getAllPermissions());
  const registeredPermissions = form.watch(`resourceServer.registeredPermissions`);
  const allowedClients = form.watch(`resourceServer.allowedClients`);
  const [allowedClientsCount, setAllowedClientsCount] = useState<number>(allowedClients?.length ?? 1);
  const { t } = useTranslation();

  if (isApplicationListLoading || isPermissionListLoading) {
    return <InlineLoadingIndicator />;
  }

  return (
    <CardWithTitle title={t("page.sub-title.oauth-application.resource-server-details")}>
      <DataRow>
        <WideDataCell>
          <Input registerReturn={form.register("resourceServer.audience", { required: true })}
                 label={t("forms:oauth-application.edit.audience")}
                 id={"oauth-application-resource-server-audience"} />
        </WideDataCell>
        <WideDataCell>
          <PermissionSelector permissions={allPermissions?.content ?? []}
                              registerReturn={form.register("resourceServer.registeredPermissions")}
                              labelKey={"forms:oauth-application.edit.registered-permissions"} />
        </WideDataCell>
      </DataRow>
      <DataRow>
        <FullWidthDataCell>
          <CountManipulationButton increase={true} counterStateSetter={setAllowedClientsCount}
                                   labelKey={"oauth-application.label.add-allowed-client"} />
        </FullWidthDataCell>
      </DataRow>
      {Array.from({ length: allowedClientsCount }, (_, index) => (
        <AllowedClientComposer key={createAllowedClientKey(form, index)} form={form} index={index}
                               setAllowedClientsCount={setAllowedClientsCount}
                               allApplications={allApplications?.content ?? []}
                               registeredPermissions={allPermissions?.content
                                 ?.filter(permission => registeredPermissions?.includes(permission.id)) ?? []} />
      ))}
    </CardWithTitle>
  );
}
