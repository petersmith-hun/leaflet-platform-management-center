import { APIEnvironment } from "@/api-environment";
import { ApplicationRelationTreeModal } from "@/components/access/oauth/ApplicationRelationTreeModal";
import { OAuthApplicationTypeIcon } from "@/components/access/oauth/OAuthApplicationTypeIcon";
import { RegenerateSecretModal } from "@/components/access/oauth/RegenerateSecretModal";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { SimpleList } from "@/components/common/SimpleList";
import { AwarenessLevel, PageOperationButton } from "@/components/navigation/OperationButton";
import { OAuthApplicationModel } from "@/core/model/oauth";
import { PermissionModel } from "@/core/model/permission";
import { oauthApplicationService } from "@/core/service/oauth-applications-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faArrowCircleRight, faFolderTree, faList, faPencil, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewOAuthApplicationScreenParameters {
  application: OAuthApplicationModel;
  environment: APIEnvironment;
  mutate: KeyedMutator<OAuthApplicationModel>;
}

const ShowApplicationTreeButton = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#oauth-application-tree-modal"
              className={`${AwarenessLevel.NORMAL} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={faFolderTree} /> {t("page-operations.oauth-application.show-tree")}
      </button>
    </div>
  )
}

const RegenerateSecretButton = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#regenerate-oauth-application-secret-modal"
              className={`${AwarenessLevel.WARNING} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={faRefresh} /> {t("page-operations.oauth-application.regenerate-secret")}
      </button>
    </div>
  )
}

const PermissionDetails = ({ permission }: { permission: PermissionModel }): ReactNode => {

  return (
    <>
      <span>{permission.name}</span>
      <br />
      <span className="pl-2 text-sm text-secondary-500">{permission.description}</span>
    </>
  )
}

const ClientApplicationDetails = ({ application }: { application: OAuthApplicationModel }): ReactNode | null => {

  const { t } = useTranslation();

  if (!application.client) {
    return null;
  }

  return (
    <CardWithTitle title={t("page.sub-title.oauth-application.client-details", { name: application.name })}>
      <DataRow>
        <WideDataCell title={t("forms:oauth-application.edit.allowed-callbacks")}>
          <SimpleList items={application.client?.allowedCallbacks} itemTemplate={item => item?.url} />
        </WideDataCell>
        <WideDataCell title={t("forms:oauth-application.edit.required-permissions")}>
          <SimpleList items={application.client?.requiredPermissions}
                      itemTemplate={permission => <PermissionDetails permission={permission} />} />
        </WideDataCell>
      </DataRow>
      <DataRow>
        <FullWidthDataCell title={t("forms:oauth-application.edit.resource-servers")}>
          <SimpleList items={application.client?.resourceServers} itemTemplate={resourceServer => (
            <Link className="text-primary-400 hover:text-primary-200" href={`/access/oauth-applications/view/${resourceServer.id}`}>
              <FontAwesomeIcon icon={faArrowCircleRight} /> {resourceServer.name}
            </Link>
          )} />
        </FullWidthDataCell>
      </DataRow>
    </CardWithTitle>
  )
}

const ResourceServerApplicationDetails = ({ application }: { application: OAuthApplicationModel }): ReactNode | null => {

  const { t } = useTranslation();

  if (!application.resourceServer) {
    return null;
  }

  return (
    <CardWithTitle title={t("page.sub-title.oauth-application.resource-server-details", { name: application.name })}>
      <DataRow>
        <WideDataCell title={t("forms:oauth-application.edit.registered-permissions")}>
          <SimpleList items={application.resourceServer?.registeredPermissions}
                      itemTemplate={permission => <PermissionDetails permission={permission} />} />
        </WideDataCell>
        <WideDataCell title={t("forms:oauth-application.edit.audience")} children={application.resourceServer?.audience} />
      </DataRow>
      <DataRow>
        <FullWidthDataCell title={t("forms:oauth-application.edit.allowed-clients")}>
          <SimpleList items={application.resourceServer?.allowedClients} itemTemplate={client => (
            <DataRow separator={false}>
              <WideDataCell>
                <Link className="text-primary-400 hover:text-primary-200" href={`/access/oauth-applications/view/${client.application.id}`}>
                  <FontAwesomeIcon icon={faArrowCircleRight} /> {client.application.name}
                </Link>
              </WideDataCell>
              <WideDataCell>
                <SimpleList items={client.allowedPermissions}
                            itemTemplate={permission => <PermissionDetails permission={permission} />} />
              </WideDataCell>
            </DataRow>
          )} />
        </FullWidthDataCell>
      </DataRow>
    </CardWithTitle>
  )
}

/**
 * Application details viewer screen component. Renders a static page with all information of the given application.
 *
 * @param application data of an existing application
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewOAuthApplicationScreen = ({ application, environment, mutate }: ViewOAuthApplicationScreenParameters): ReactNode => {

  const { deleteApplicationByID, enableApplication, disableApplication } = oauthApplicationService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <CardWithTitle title={application.name}>
          <DataRow>
            <WideDataCell title={t("forms:oauth-application.edit.name")} children={application.name} />
            <NarrowDataCell title={t("forms:oauth-application.edit.general-status")}>
              <ItemEnabledStatusFlag item={application} />
            </NarrowDataCell>
            <NarrowDataCell title={t("forms:oauth-application.edit.application-type")}>
              <OAuthApplicationTypeIcon item={application} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:oauth-application.edit.client-id")} children={application.clientID} />
            <NarrowDataCell title={t("forms:oauth-application.edit.created-at")}
                            children={dateFormatter(application.created)} />
            <NarrowDataCell title={t("forms:oauth-application.edit.last-modified-at")}
                            children={dateFormatter(application.lastModified) ?? t("oauth-application.label.never-modified")} />
          </DataRow>
        </CardWithTitle>
        <ClientApplicationDetails application={application} />
        <ResourceServerApplicationDetails application={application} />
      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.oauth-application")}>
          <PageOperationButton label={t("page-operations.oauth-application.edit")} icon={faPencil}
                               link={`/access/oauth-applications/edit/${application.id}`} />
          <PageOperationButton label={t("page-operations.oauth-application.back-to-applications")} icon={faList}
                               link={"/access/oauth-applications"} />
          <ShowApplicationTreeButton />
          <RegenerateSecretButton />
          <GeneralStatusUpdateOperation domain={"oauth-application"} entity={application} titleSupplier={application => application.name}
                                        operation={application.enabled ? "status-disable" : "status-enable"}
                                        serviceCall={(id: string) => application.enabled
                                          ? disableApplication(id)
                                          : enableApplication(id)} mutate={mutate} />
          <DeleteOperation domain={"oauth-application"} entity={application}
                           titleSupplier={application => application.name}
                           serviceCall={deleteApplicationByID} />
        </PageOperationCard>
      </NarrowPane>
      <ApplicationRelationTreeModal application={application} />
      <RegenerateSecretModal application={application} environment={environment} />
    </MultiPaneScreen>
  )
}
