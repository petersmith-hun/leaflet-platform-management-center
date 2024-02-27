import { APIEnvironment } from "@/api-environment";
import { ItemListCard } from "@/components/common/Cards";
import { ToastType } from "@/components/common/OperationResultToast";
import { DropdownMenu } from "@/components/navigation/DropdownMenu";
import { AwarenessLevel, ConfirmedOperationButton } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { DockerRepository, TagDescriptor } from "@/core/model/docker-registry";
import { registryBrowserService } from "@/core/service/registry-browser-service";
import { PageContext } from "@/pages/_app";
import { faEdit, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface RepositoryTagCardProps {
  tag: TagDescriptor;
  environment: APIEnvironment;
  mutate: KeyedMutator<DockerRepository>;
}

/**
 * Renders a card showing information about a specific Docker image tag.
 *
 * @param tag image tag data
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function to invalidate the cache storing data of the selected repository
 */
export const RepositoryTagCard = ({ tag, environment, mutate }: RepositoryTagCardProps): ReactNode => {

  const { deleteDockerImageByTag } = registryBrowserService(environment);
  const { t } = useTranslation();
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { handleAxiosError, showCustomToast } = toastHandler(triggerToast, t);

  const deleteHandler = (): void => {

    setOperationInProgress(true);
    deleteDockerImageByTag(tag.registryID, tag.repositoryID, tag.tag)
      .then(() => mutate())
      .then(() => router.push(`/system/docker/registry/${tag.registryID}/${tag.repositoryIDClean}`))
      .then(_ => showCustomToast(
        t("toast.docker-registry.updated"),
        t("toast.docker.registry.tag-deleted", {
          repository: tag.repositoryIDClean,
          tag: tag.tag
        }),
        ToastType.WARNING
      ))
      .catch(handleAxiosError)
      .finally(() => setOperationInProgress(false));
  }

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <FontAwesomeIcon icon={faTag} /> {tag.tag}
        </h5>
      </div>
      <div className="w-5/12">
        <FontAwesomeIcon icon={faEdit} /> {tag.created}
      </div>
      <div className="w-2/12 flex flex-col items-center">
        <DropdownMenu id={`tag-menu-${tag.tag}`}>
          <ConfirmedOperationButton label={t("dropdown.operation.delete")} popconfirmDomain={"docker-tag"}
                                    icon={faTrash} awareness={AwarenessLevel.ALERT}
                                    id={`delete-${tag.tag.replaceAll(".", "_")}`}
                                    onSubmit={deleteHandler} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
