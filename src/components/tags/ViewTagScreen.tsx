import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { TagModel } from "@/core/model/tag";
import tagService from "@/core/service/tag-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewTagScreenParameters {
  tag: TagModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<TagModel>;
}

/**
 * Tag viewer screen component. Renders a static page with all information of the given tag.
 *
 * @param tag data of an existing tag
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewTagScreen = ({ tag, environment, mutate }: ViewTagScreenParameters): ReactNode => {

  const { changeGeneralStatus, deleteTagByID } = tagService(environment);
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
          <GeneralStatusUpdateOperation domain={"tag"} entity={tag} titleSupplier={tag => tag.name}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <DeleteOperation domain={"tag"} entity={tag} titleSupplier={tag => tag.name}
                           serviceCall={deleteTagByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
