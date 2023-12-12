import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { ViewTagScreenParameters } from "@/components/tags/operations";
import { TagDeletion } from "@/components/tags/operations/TagDeletion";
import { TagGeneralStatusUpdate } from "@/components/tags/operations/TagGeneralStatusUpdate";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Screen used by tag manager's create/edit operations. For editing purpose, provide the tag itself in the tag
 * parameter, as well as an SWR mutate function to invalidate the data cache for the edited tag.
 *
 * @param tag data of an existing tag
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewTagScreen = ({ tag, environment, mutate }: ViewTagScreenParameters): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={tag.name}>
          <DataRow>
            <WideDataCell title={t("forms:tag.edit.name")} children={tag.name} />
            <NarrowDataCell title={t("forms:tag.edit.general-status")}>
              <ItemEnabledStatusFlag item={tag} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:tag.edit.created-at")}
                            children={dateFormatter(tag.created)} />
            <NarrowDataCell title={t("forms:tag.edit.last-modified-at")}
                            children={dateFormatter(tag.lastModified) ?? t("tag.label.never-modified")} />
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.tag")}>
          <PageOperationButton label={t("page-operations.tag.edit")} icon={faPencil}
                               link={`/tags/edit/${tag.id}`} />
          <PageOperationButton label={t("page-operations.tag.back-to-tags")} icon={faList}
                               link={"/tags"} />
          <TagGeneralStatusUpdate tag={tag} environment={environment} mutate={mutate} />
          <TagDeletion tag={tag} environment={environment} mutate={mutate} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
