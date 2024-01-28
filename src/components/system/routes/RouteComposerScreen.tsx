import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { AuthRequirement, FrontEndRouteDataModel, FrontEndRouteRequestModel, RouteType } from "@/core/model/routes";
import { routesService } from "@/core/service/routes-service";
import { faEye, faList } from "@fortawesome/free-solid-svg-icons";
import { TFunction } from "i18next";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface RouteComposerScreenProps {
  environment: APIEnvironment;
  route?: FrontEndRouteDataModel;
  mutate?: KeyedMutator<FrontEndRouteDataModel>;
}

const generateOptions = (t: TFunction, translationNode: string, optionsEnum: object): Record<string, string> => {

  const entries = Object.keys(optionsEnum)
    .map(option => [option, t(`forms:route.edit.${translationNode}.${option}`)]);

  return Object.fromEntries(entries);
}

/**
 * Screen used by frontend route manager's create/edit operations. For editing purpose, provide the route itself, as
 * well as an SWR mutate function to invalidate the cache for the edited route.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param route route data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const RouteComposerScreen = ({ environment, route, mutate }: RouteComposerScreenProps): ReactNode => {

  const { createRoute, updateRoute } = routesService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FrontEndRouteRequestModel>({
    defaultValues: route
  });
  const router = useRouter();
  const routeID = router.query.id as number | undefined;

  useEffect(() => {
    const init = async () => {
      const { Input, Select, initTE } = await import("tw-elements");
      initTE({ Input, Select }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <SubmitOperation domain={"route"} mutate={mutate} titleSupplier={route => route.name}
                     handleSubmit={handleSubmit}
                     serviceCall={entity => routeID
                       ? updateRoute(routeID, entity)
                       : createRoute(entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={route?.name ?? t("page.title.system.route.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("name", { required: t("forms:validation.common.required") })}
                       label={t("forms:route.edit.name")} id={"route-name"}
                       errorSupplier={() => errors.name?.message} />
              </WideDataCell>
              <WideDataCell>
                <Input registerReturn={register("routeId", { required: t("forms:validation.common.required") })}
                       label={t("forms:route.edit.route-id")} id={"route-id"}
                       errorSupplier={() => errors.routeId?.message} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("url", { required: t("forms:validation.common.required") })}
                       label={t("forms:route.edit.url")} id={"route-url"}
                       errorSupplier={() => errors.url?.message} />
              </WideDataCell>
              <WideDataCell>
                <Input registerReturn={register("sequenceNumber", { required: t("forms:validation.common.required") })}
                       label={t("forms:route.edit.sequence-number")} id={"route-sequence-number"}
                       errorSupplier={() => errors.sequenceNumber?.message} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <WideDataCell>
                <Select registerReturn={register("type")} label={t("forms:route.edit.type")}
                        optionMap={generateOptions(t, "type", RouteType)} />
              </WideDataCell>
              <WideDataCell>
                <Select registerReturn={register("authRequirement")} label={t("forms:route.edit.auth-requirement")}
                        optionMap={generateOptions(t, "auth-requirement", AuthRequirement)} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.route")}>
            <PageOperationButton label={t("page-operations.route.back-to-routes")} icon={faList}
                                 link={"/system/routes"} />
            {routeID && <PageOperationButton label={t("page-operations.route.view")} icon={faEye}
                                             link={`/system/routes/view/${routeID}`} />}
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
