import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { PackLocale, TranslationPackCreationFormData, TranslationPackCreationRequest } from "@/core/model/translations";
import { translationService } from "@/core/service/translation-service";
import { faCheckCircle, faCircleInfo, faList, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TFunction } from "i18next";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface TranslationPackComposerScreenProps {
  environment: APIEnvironment;
}

const generateOptions = (t: TFunction): Record<string, string> => {

  const entries = Object.values(PackLocale)
    .map(option => [option, t(`forms:pack.edit.locale.${option}`)]);

  return Object.fromEntries(entries);
}

// TODO extract tooltip (3 usage already)
const DefinitionTooltip = (): ReactNode => {

  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      const { Tooltip, initTE } = await import("tw-elements");
      initTE({ Tooltip }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <span
      className="transititext-primary text-neutral transition duration-150 ease-in-out hover:text-neutral-600 focus:text-neutral-600 active:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:active:text-neutral-600"
      data-te-toggle="tooltip"
      title={t("system.translations.definitions.label.identified-tooltip")}>
      <FontAwesomeIcon icon={faCircleInfo} />
    </span>
  )
}

const splitDefinitions = (definitionCSV: string): Record<string, string> => {

  return Object.fromEntries(definitionCSV.split(/\r?\n/)
    .filter(line => line.includes(";"))
    .map(line => line.split(";", 2))
    .filter(definition => definition[0].length && definition[1].length)
    .map(definition => {
      return [definition[0], definition[1]]
    }));
}

const convertFormDataToRequest = (formData: TranslationPackCreationFormData): TranslationPackCreationRequest => {

  return {
    packName: formData.packName,
    locale: formData.locale,
    definitions: splitDefinitions(formData.packCSVData)
  }
}

/**
 * Screen used by translation manager's create operations.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const TranslationPackComposerScreen = ({ environment }: TranslationPackComposerScreenProps): ReactNode => {

  const { createPack } = translationService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<TranslationPackCreationFormData>();
  const [definitionsCount, setDefinitionsCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { Input, Select, initTE } = await import("tw-elements");
      initTE({ Input, Select }, { allowReinits: true });
    };
    init();

    const definitionTextarea = document.querySelector("#pack-definitions") as HTMLInputElement | null;
    definitionTextarea?.addEventListener("keyup", () => {
      const definitions = splitDefinitions(definitionTextarea.value ?? "");
      setDefinitionsCount(Object.keys(definitions).length);
    });

  }, []);

  return (
    <SubmitOperation domain={"translation"}
                     titleSupplier={pack => `${pack.packName} [${t(`forms:pack.edit.locale.${pack.locale}`)}]`}
                     handleSubmit={handleSubmit}
                     serviceCall={formData => createPack(convertFormDataToRequest(formData))}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={t("page.title.system.translation.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("packName", { required: t("forms:validation.common.required") })}
                       label={t("forms:pack.edit.name")} id={"pack-name"}
                       errorSupplier={() => errors.packName?.message} />
              </WideDataCell>
              <WideDataCell>
                <Select registerReturn={register("locale")} label={t("forms:pack.edit.locale")}
                        optionMap={generateOptions(t)} />
              </WideDataCell>
            </DataRow>
            <DataRow>
              <FullWidthDataCell>
                <p className="p-3">
                  <span className="mr-1">
                    {definitionsCount
                      ? <FontAwesomeIcon icon={faCheckCircle} />
                      : <FontAwesomeIcon icon={faWarning} />
                    }
                  </span>
                  <span className="mr-1">
                    {t("system.translations.definitions.label.identified-count")}:
                    <span
                      className="ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700">{definitionsCount}</span>
                  </span>
                  <DefinitionTooltip />
                </p>
                <Textarea registerReturn={register("packCSVData", { required: t("forms:validation.common.required") })}
                          label={t("forms:pack.edit.definitions")}
                          id={"pack-definitions"} defaultRowCount={50} />
              </FullWidthDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.translation")}>
            <PageOperationButton label={t("page-operations.translation.back-to-packs")} icon={faList}
                                 link={"/system/translations"} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
