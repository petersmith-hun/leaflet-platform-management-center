import { APIEnvironment } from "@/api-environment";
import { CountManipulationButton, PermissionSelector } from "@/components/access/oauth/utils";
import { CardWithTitle } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { Input } from "@/components/form/Input";
import { OAuthApplicationRegistrationRequest } from "@/core/model/oauth";
import { permissionService } from "@/core/service/permissions-service";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface ClientApplicationComposerProps {
  environment: APIEnvironment;
  form: UseFormReturn<OAuthApplicationRegistrationRequest>;
}

interface AllowedCallbackComposerProps {
  form: UseFormReturn<OAuthApplicationRegistrationRequest>;
  index: number;
  setAllowedCallbacksCount: Dispatch<SetStateAction<number>>;
}

const AllowedCallbackComposer = ({ form, index, setAllowedCallbacksCount }: AllowedCallbackComposerProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <DataRow>
      <WideDataCell>
        <input type="hidden" {...form.register(`client.allowedCallbacks.${index}.id`)} />
        <Input registerReturn={form.register(`client.allowedCallbacks.${index}.url`, { required: true })}
               label={t("forms:oauth-application.edit.allowed-callback")}
               id={"oauth-application-client-allowed-callback"} />
      </WideDataCell>
      <CountManipulationButton increase={false} counterStateSetter={setAllowedCallbacksCount} callback={() => {
        const current = form.getValues("client.allowedCallbacks");
        if (current) {
          current.splice(index, 1);
          form.setValue("client.allowedCallbacks", current, { shouldDirty: true });
          form.resetField("client.allowedCallbacks", { defaultValue: current, keepDirty: true });
        }
      }} />
    </DataRow>
  )
}

const createAllowedCallbackKey = (form: UseFormReturn<OAuthApplicationRegistrationRequest>, index: number): string => {
  return `allowed-callback-${index}-${form.getValues(`client.allowedCallbacks.${index}.id`)}`;
}

/**
 * OAuth application composer screen segment for defining the client settings of an application registration.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param form main composer form instance
 */
export const ClientApplicationComposer = ({ environment, form }: ClientApplicationComposerProps): ReactNode => {

  const { getAllPermissions } = permissionService(environment);
  const { isLoading: isPermissionListLoading, data: allPermissions } = useSWR("allPermissionsUnpaged", () => getAllPermissions());
  const allowedCallbacks = form.watch(`client.allowedCallbacks`);
  const [allowedClientsCount, setAllowedClientsCount] = useState<number>(allowedCallbacks?.length ?? 1);
  const { t } = useTranslation();

  if (isPermissionListLoading) {
    return <InlineLoadingIndicator />;
  }

  return (
    <CardWithTitle title={t("page.sub-title.oauth-application.client-details")}>
      <DataRow>
        <FullWidthDataCell>
          <CountManipulationButton increase={true} counterStateSetter={setAllowedClientsCount}
                                   labelKey={"oauth-application.label.add-allowed-callback"} />
        </FullWidthDataCell>
      </DataRow>
      {Array.from({ length: allowedClientsCount }, (_, index) => (
        <AllowedCallbackComposer key={createAllowedCallbackKey(form, index)} form={form} index={index}
                                 setAllowedCallbacksCount={setAllowedClientsCount} />
      ))}
      <DataRow>
        <WideDataCell>
          <PermissionSelector permissions={allPermissions?.content ?? []}
                              registerReturn={form.register("client.requiredPermissions")}
                              labelKey={"forms:oauth-application.edit.required-permissions"} />
        </WideDataCell>
      </DataRow>
    </CardWithTitle>
  );
}
