import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { TranslationDefinitionsTable } from "@/components/system/translations/TranslationDefinitionsTable";
import { TranslationPack } from "@/core/model/translations";
import { translationService } from "@/core/service/translation-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewTranslationPackScreenProps {
  pack: TranslationPack;
  environment: APIEnvironment;
  mutate: KeyedMutator<TranslationPack>;
}

/**
 * Translation pack details viewer screen component. Renders a static page with all information of the given pack.
 *
 * @param pack data of an existing translation pack
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewTranslationPackScreen = ({ pack, environment, mutate }: ViewTranslationPackScreenProps): ReactNode => {

  const { changeGeneralStatus, deletePackByID } = translationService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={pack.packName}>
          <DataRow>
            <WideDataCell title={t("forms:pack.edit.name")} children={pack.packName} />
            <NarrowDataCell title={t("forms:pack.edit.general-status")}>
              <ItemEnabledStatusFlag item={pack} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:pack.edit.locale")} children={t(`forms:pack.edit.locale.${pack.locale}`)} />
            <NarrowDataCell title={t("forms:pack.edit.created-at")} children={dateFormatter(pack.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:pack.edit.definition-count")} children={pack.definitions.length} />
          </DataRow>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.system.translations.definitions")}>
          <DataRow>
            <FullWidthDataCell>
              <TranslationDefinitionsTable pack={pack} />
            </FullWidthDataCell>
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.translation")}>
          <PageOperationButton label={t("page-operations.translation.back-to-packs")} icon={faList}
                               link={"/system/translations"} />
          <GeneralStatusUpdateOperation domain={"translation"} entity={pack} titleSupplier={pack => pack.packName}
                                        operation={pack.enabled ? "status-disable" : "status-enable"}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <DeleteOperation domain={"translation"} entity={pack} titleSupplier={pack => pack.packName}
                           serviceCall={deletePackByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
