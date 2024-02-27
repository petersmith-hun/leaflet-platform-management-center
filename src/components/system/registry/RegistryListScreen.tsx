import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen } from "@/components/common/ScreenLayout";
import { RegistryBrowserOperations } from "@/components/system/registry/RegistryBrowserOperations";
import { RegistryCard } from "@/components/system/registry/RegistryCard";
import { noOpPagination } from "@/core/model/common";
import React, { ReactNode } from "react";

interface RegistryListScreenProps {
  registries: Record<string, string>;
}

/**
 * Renders the list of configured registries.
 *
 * @param registries configured registry ID - URL pairs as records
 */
export const RegistryListScreen = ({ registries }: RegistryListScreenProps): ReactNode => {

  return (
    <MultiPaneScreen>
      <ItemListPane pagination={noOpPagination}>
        <ItemListHeader>
          <ItemListHeaderItem titleKey={"header.system.docker-registry.registry-data"} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={""} widthClass={"w-5/12"} />
          <ItemListHeaderItem titleKey={"header.system.docker-registry.operations"} widthClass={"w-2/12"} />
        </ItemListHeader>
        <ItemListBody data={Object.keys(registries)}>
          {(registryID) => <RegistryCard key={`registry-${registryID}`} registryID={registryID} registryURL={registries[registryID]} />}
        </ItemListBody>
      </ItemListPane>
      <RegistryBrowserOperations />
    </MultiPaneScreen>
  )
}
