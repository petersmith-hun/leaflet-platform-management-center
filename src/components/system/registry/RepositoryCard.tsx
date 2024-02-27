import { ItemListCard } from "@/components/common/Cards";
import { DropdownMenu, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { RepositoryDescriptor } from "@/core/model/docker-registry";
import { faDocker } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";

interface RepositoryCardProps {
  repository: RepositoryDescriptor;
}

/**
 * Renders a card showing information about the selected repository.
 *
 * @param repository Docker repository data
 */
export const RepositoryCard = ({ repository }: RepositoryCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/system/docker/registry/${repository.registryID}/${repository.repositoryIDClean}`} className="text-primary-400 hover:text-primary-200">
            <FontAwesomeIcon icon={faDocker} /> {repository.repositoryID}
          </Link>
        </h5>
      </div>
      <div className="w-5/12">&nbsp;</div>
      <div className="w-2/12 flex flex-col items-center">
        <DropdownMenu id={`repository-menu-${repository.repositoryIDClean}`}>
          <ViewDropdownMenuItem link={`/system/docker/registry/${repository.registryID}/${repository.repositoryIDClean}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
