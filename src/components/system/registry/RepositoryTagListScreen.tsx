import { APIEnvironment } from "@/api-environment";
import { CardWithTitle } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen } from "@/components/common/ScreenLayout";
import { createTagDescriptor } from "@/components/system/registry/index";
import { RegistryBrowserOperations } from "@/components/system/registry/RegistryBrowserOperations";
import { RepositoryTagCard } from "@/components/system/registry/RepositoryTagCard";
import { noOpPagination } from "@/core/model/common";
import { DockerRepository } from "@/core/model/docker-registry";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface RepositoryTagListScreenProps {
  repository: DockerRepository;
  environment: APIEnvironment;
  mutate: KeyedMutator<DockerRepository>;
}

/**
 * Renders the repository tags screen.
 *
 * @param repository data of the selected repository, containing the existing tags in the repository
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function to invalidate the cache storing data of the selected repository
 */
export const RepositoryTagListScreen = ({ repository, environment, mutate }: RepositoryTagListScreenProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        <CardWithTitle title={`${repository.registry} > ${repository.name}`}>
          <span>
            <FontAwesomeIcon className="mr-1" icon={faInfoCircle} />
            {t("system.docker-registry.label.number-of-tags", {
              count: repository.tags?.length ?? 0
            })}
          </span>
        </CardWithTitle>
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.system.docker-tag.name"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.system.docker-tag.created"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.system.docker-tag.operations"} widthClass={"w-2/12"} />
        </ItemListHeader>
        <ItemListBody data={repository.tags}>
          {(tag) => (
            <RepositoryTagCard key={`repository-tag-${tag.name}`} environment={environment} mutate={mutate}
                               tag={createTagDescriptor(repository.registry, repository.name, tag)} />
          )}
        </ItemListBody>
      </ItemListPane>
      <RegistryBrowserOperations registryID={repository.registry} />
    </MultiPaneScreen>
  )
}
