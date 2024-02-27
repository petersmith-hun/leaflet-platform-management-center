import { PageOperationCard } from "@/components/common/Cards";
import { NarrowPane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { faList } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface RegistryBrowserOperationsProps {
  registryID?: string;
}

/**
 * Renders the page operations block for Docker Registry browser screens.
 *
 * @param registryID Docker Registry ID
 */
export const RegistryBrowserOperations = ({ registryID }: RegistryBrowserOperationsProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <NarrowPane>
      <PageOperationCard title={t("page-operations.docker-registry-browser")}>
        <PageOperationButton label={t("page-operations.docker-registry-browser.list-registries")} icon={faList}
                             link={"/system/docker/registry"} />
        {registryID && (
          <PageOperationButton label={t("page-operations.docker-registry-browser.list-repositories")} icon={faList}
                               link={`/system/docker/registry/${registryID}`} />
        )}
      </PageOperationCard>
    </NarrowPane>
  )
}
