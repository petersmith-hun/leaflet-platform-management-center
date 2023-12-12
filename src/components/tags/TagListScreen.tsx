import { ScreenParameters } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { TagCard } from "@/components/tags/TagCard";
import { noOpPagination } from "@/core/model/common";
import { TagModel } from "@/core/model/tag";
import tagService from "@/core/service/tag-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface TagListResultProps {
  tags: TagModel[];
}

const TagListResult = ({ tags }: TagListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={noOpPagination}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.tags.tag"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.tags.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.tags.status"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.tags.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={tags}>
        {(tag: TagModel) => <TagCard tag={tag} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of tag manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const TagListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllTags } = tagService(environment);
  const { isLoading, data, error } = useSWR(swrNumberKey("tags", "all"), getAllTags);

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <TagListResult tags={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.tag")}>
          <PageOperationButton label={t("page-operations.tag.new")} icon={faEdit} link="/tags/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
