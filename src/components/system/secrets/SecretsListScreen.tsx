import { APIEnvironment, ScreenParameters } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { NoDataScreen } from "@/components/common/NoDataScreen";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { SecretCard } from "@/components/system/secrets/SecretCard";
import { SecretModal } from "@/components/system/secrets/SecretModal";
import { noOpPagination } from "@/core/model/common";
import { GroupedSecretMetadataModel, SecretMetadataModel } from "@/core/model/secrets";
import { secretService } from "@/core/service/secret-service";
import { swrKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { wait } from "next/dist/lib/wait";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface SecretListProps {
  environment: APIEnvironment;
  secrets: GroupedSecretMetadataModel[];
}

const SecretListOperations = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <NarrowPane>
      <PageOperationCard title={t("page-operations.secret")}>
        <PageOperationButton label={t("page-operations.secret.new")} icon={faEdit}
                             link="/system/secrets/create" />
      </PageOperationCard>
    </NarrowPane>
  )
}

const SecretsList = ({ environment, secrets }: SecretListProps): ReactNode => {

  const [secretModalTitle, setSecretModalTitle] = useState("");
  const [secretModalValue, setSecretModalValue] = useState<ReactNode | string | null>(null);

  const handleModalClose = async () => {
    await wait(300);
    setSecretModalTitle("");
    setSecretModalValue(null);
  }

  if (secrets.length === 0) {
    return (
      <MultiPaneScreen>
        <NoDataScreen />
        <SecretListOperations />
      </MultiPaneScreen>
    )
  }

  return secrets.map((group, index) => (
    <React.Fragment key={group.context}>
      <MultiPaneScreen>
        <ItemListPane pagination={noOpPagination}>
          <ItemListHeader title={group.context}>
            <ItemListHeaderItem titleKey={"header.system.secret.base"} widthClass={"w-4/12"} />
            <ItemListHeaderItem titleKey={"header.system.secret.dates"} widthClass={"w-3/12"} />
            <ItemListHeaderItem titleKey={"header.system.secret.last-access"} widthClass={"w-3/12"} />
            <ItemListHeaderItem titleKey={"header.system.secret.operations"} widthClass={"w-2/12"} />
          </ItemListHeader>
          <ItemListBody data={group.secrets}>
            {(secret: SecretMetadataModel) => (
              <SecretCard environment={environment} secret={secret} key={`secret-${secret.key}`}
                          setSecretModalTitle={setSecretModalTitle}
                          setSecretModalValue={setSecretModalValue} />
            )}
          </ItemListBody>
        </ItemListPane>
        {!index && <SecretListOperations />}
      </MultiPaneScreen>
      {!index && (
        <SecretModal title={secretModalTitle} value={secretModalValue} onClose={handleModalClose} />
      )}
      <p>&nbsp;</p>
    </React.Fragment>
  ))
}

/**
 * Screen component for listing the existing secrets.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const SecretListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { getAllSecretMetadata } = secretService(environment);
  const { isLoading, error, data } = useSWR(swrKey("system/domino-secrets", "all"), getAllSecretMetadata);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <SecretsList secrets={data!} environment={environment} />}
    </SWRManagedScreen>
  )
}
