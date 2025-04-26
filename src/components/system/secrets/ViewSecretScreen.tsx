import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { RetrieveSecretButton, SecretModal, SecretRetrievalError } from "@/components/system/secrets/SecretModal";
import { SecretMetadataModel } from "@/core/model/secrets";
import { secretService } from "@/core/service/secret-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";
import { wait } from "next/dist/lib/wait";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewSecretScreenParameters {
  secret: SecretMetadataModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<SecretMetadataModel>;
}

/**
 * Secret viewer screen component. Renders a static page with all metadata of the given secret.
 *
 * @param secret metadata of an existing secret
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewSecretScreen = ({ secret, environment, mutate }: ViewSecretScreenParameters): ReactNode => {

  const { getSecret, switchRetrieval, deleteSecret } = secretService(environment);
  const { t } = useTranslation();
  const [secretModalTitle, setSecretModalTitle] = useState("");
  const [secretModalValue, setSecretModalValue] = useState<ReactNode | string | null>(null);

  const handleModalClose = async () => {
    await wait(300);
    setSecretModalTitle("");
    setSecretModalValue(null);
  }

  const handleShowSecret = (key: string) => {

    setSecretModalTitle(key);

    getSecret(key)
      .then(value => setSecretModalValue(value[key]))
      .catch((axiosError: AxiosError) => setSecretModalValue(<SecretRetrievalError axiosError={axiosError} />));
  }

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={secret.key}>
          <DataRow>
            <WideDataCell title={t("forms:secret.edit.context")} children={secret.context} />
            <NarrowDataCell title={t("forms:secret.edit.retrievable")}>
              <ItemEnabledStatusFlag item={{ enabled: secret.retrievable }} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:secret.edit.created-at")}
                          children={dateFormatter(secret.createdAt)} />
            <NarrowDataCell title={t("forms:secret.edit.updated-at")}
                            children={dateFormatter(secret.updatedAt) ?? t("secret.label.never-modified")} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:secret.edit.last-accessed-by")}
                          children={secret.lastAccessedBy ?? t("system.secrets.label.never-accessed")} />
            <NarrowDataCell title={t("forms:secret.edit.last-accessed-at")}
                            children={dateFormatter(secret.lastAccessedAt) ?? t("system.secrets.label.never-accessed")} />
          </DataRow>
        </CardWithTitle>
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.secret")}>
          <PageOperationButton label={t("page-operations.secret.back-to-dsm")} icon={faList}
                               link={"/system/secrets"} />
          {secret.retrievable && (
            <RetrieveSecretButton onClick={() => handleShowSecret(secret.key)} />
          )}
          {/*@ts-ignore*/}
          <GeneralStatusUpdateOperation domain={"secret-retrieval"} entity={{ id: secret.key, enabled: secret.retrievable }}
                                        operation={secret.retrievable ? "retrieval-disable" : "retrieval-enable"}
                                        titleSupplier={secret => secret.id} mutate={mutate}
                                        serviceCall={(key: string) => switchRetrieval(key, secret)} />
          <DeleteOperation domain={"secret"} entity={secret} titleSupplier={secret => secret.key}
                           idProvider={secret => secret.key}
                           serviceCall={deleteSecret} />
        </PageOperationCard>
      </NarrowPane>
      <SecretModal title={secretModalTitle} value={secretModalValue} onClose={handleModalClose} />
    </MultiPaneScreen>
  )
}
