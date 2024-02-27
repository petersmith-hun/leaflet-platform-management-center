import { CardWithTitle } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen } from "@/components/common/ScreenLayout";
import { createRepositoryDescriptor } from "@/components/system/registry/index";
import { RegistryBrowserOperations } from "@/components/system/registry/RegistryBrowserOperations";
import { RepositoryCard } from "@/components/system/registry/RepositoryCard";
import { noOpPagination } from "@/core/model/common";
import { DockerRegistryContent } from "@/core/model/docker-registry";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface RepositoryListScreenProps {
  registry: DockerRegistryContent;
}

/**
 * Renders the list of repositories in the selected Docker Registry.
 *
 * @param registry Docker Registry contents, including the list of repositories
 */
export const RepositoryListScreen = ({ registry }: RepositoryListScreenProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        <CardWithTitle title={registry.registryName}>
          <span>
            <FontAwesomeIcon className="mr-1" icon={faInfoCircle} />
            {t("system.docker-registry.label.number-of-repositories", {
              count: registry.repositories?.length ?? 0
            })}
          </span>
        </CardWithTitle>
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.system.docker-repository.name"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={""} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.system.docker-repository.operations"} widthClass={"w-2/12"} />
        </ItemListHeader>
        <ItemListBody data={registry.repositories}>
          {(repositoryID) => (
            <RepositoryCard key={`repository-${repositoryID}`} repository={createRepositoryDescriptor(registry.registryName, repositoryID)} />
          )}
        </ItemListBody>
      </ItemListPane>
      <RegistryBrowserOperations />
    </MultiPaneScreen>
  )
}
