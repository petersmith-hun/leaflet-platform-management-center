import { ScreenParameters } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { TranslationPackCard } from "@/components/system/translations/TranslationPackCard";
import { noOpPagination } from "@/core/model/common";
import { TranslationPackMetaInfo } from "@/core/model/translations";
import { translationService } from "@/core/service/translation-service";
import { swrKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface TranslationPackListProps {
  packs: TranslationPackMetaInfo[];
}

const TranslationPackList = ({ packs }: TranslationPackListProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.translation.name"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.translation.dates"} widthClass={"w-3/12"} />
          <ItemListHeaderItem titleKey={"header.translation.status"} widthClass={"w-2/12"} />
          <ItemListHeaderItem titleKey={"header.translation.operations"} widthClass={"w-2/12"} />
        </ItemListHeader>
        <ItemListBody data={packs}>
          {(pack: TranslationPackMetaInfo) => <TranslationPackCard pack={pack} key={`translation-pack-${pack.id}`} />}
        </ItemListBody>
      </ItemListPane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.translation")}>
          <PageOperationButton label={t("page-operations.translation.new")} icon={faEdit} link="/system/translations/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}

/**
 * Screen component for listing the existing translation packs.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const TranslationPackListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { getPacks } = translationService(environment);
  const { isLoading, error, data } = useSWR(swrKey("system/translations", "all"), getPacks);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <TranslationPackList packs={data!} />}
    </SWRManagedScreen>
  )
}
