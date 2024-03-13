import { APIEnvironment, ScreenParameters } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { toastHandler } from "@/components/utility/toast-handler";
import defaultSEOFacade from "@/core/facade/default-seo-facade";
import { SEOConfigurationModel } from "@/core/model/dcp";
import { swrKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import React, { ReactNode, useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSWR, { KeyedMutator } from "swr";

interface SEOEditorProps {
  environment: APIEnvironment;
  seo: SEOConfigurationModel;
  mutate: KeyedMutator<SEOConfigurationModel>;
}

const SEOEditor = ({ environment, seo, mutate }: SEOEditorProps): ReactNode => {

  const { updateConfiguration } = defaultSEOFacade(environment);
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<SEOConfigurationModel>({
    defaultValues: seo
  });
  const { setOperationInProgress, triggerToast } = useContext(PageContext);
  const { showCustomToast, handleAxiosError } = toastHandler(triggerToast, t);

  const onSubmit: SubmitHandler<SEOConfigurationModel> = (request: SEOConfigurationModel) => {

    setOperationInProgress(true);
    updateConfiguration(request)
      .then(_ => mutate())
      .then(_ => showCustomToast(
        t("toast.system-configuration.updated"),
        t("toast.system-configuration.seo.updated")
      ))
      .catch(handleAxiosError)
      .finally(() => setOperationInProgress(false));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={t("page.sub-title.system.seo-update")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("pageTitle")} label={t("forms:seo.edit.page-title")}
                       id={"seo-pageTitle"} />
              </WideDataCell>
              <WideDataCell>
                <Input registerReturn={register("defaultTitle")} label={t("forms:seo.edit.default-title")}
                       id={"seo-defaultTitle"} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <WideDataCell>
                <Textarea registerReturn={register("defaultDescription")}
                          label={t("forms:seo.edit.default-description")} id={"seo-defaultDescription"} />
              </WideDataCell>
              <WideDataCell>
                <Input registerReturn={register("defaultKeywords")} label={t("forms:seo.edit.default-keywords")}
                       id={"seo-defaultKeywords"} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.seo")}>
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </form>
  )
}

/**
 * Screen component for editing the default SEO configuration.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const DefaultSEOEditorScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { retrieveConfiguration } = defaultSEOFacade(environment);
  const { isLoading, error, data, mutate } = useSWR(swrKey("system/seo", "all"), retrieveConfiguration);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <SEOEditor seo={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
