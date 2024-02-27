import { ItemListCard } from "@/components/common/Cards";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { faDocker } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";

interface RegistryCardProps {
  registryID: string;
  registryURL: string;
}

/**
 * Renders a card showing the data of a specific Docker Registry.
 *
 * @param registryID Docker Registry ID
 * @param registryURL host URL of the registry
 */
export const RegistryCard = ({ registryID, registryURL }: RegistryCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/system/docker/registry/${registryID}`} className="text-primary-400 hover:text-primary-200">
            <FontAwesomeIcon icon={faDocker} /> {registryID}
          </Link>
        </h5>
        <Separator thick={false} />
        <span className="text-sm">
          <FontAwesomeIcon className="h-4 w-4" icon={faLink} /> {registryURL}
        </span>
      </div>
      <div className="w-5/12">&nbsp;</div>
      <div className="w-2/12 flex flex-col items-center">
        <DropdownMenu id={`registry-menu-${registryID}`}>
          <ViewDropdownMenuItem link={`/system/docker/registry/${registryID}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
