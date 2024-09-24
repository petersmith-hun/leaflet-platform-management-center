import { ItemListCard } from "@/components/common/Cards";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { descriptionMapping } from "@/components/system/deployments";
import { DeploymentSummary } from "@/core/model/domino";
import { faBoxArchive, faDice, faFileCode, faHouse, faRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface DeploymentCardProps {
  deployment: DeploymentSummary;
}

/**
 * Renders a card in the Domino deployment definitions list displaying the summary of a definition.
 *
 * @param deployment Domino deployment definition
 */
export const DeploymentCard = ({ deployment }: DeploymentCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/system/deployments/view/${deployment.id}`} className="text-primary-400 hover:text-primary-200">
            <FontAwesomeIcon icon={faDice} /> {deployment.id}
          </Link>
        </h5>
        <Separator thick={false} />
        <span className="w-4/12 inline-block">
          <FontAwesomeIcon className="h-4 w-4" icon={faBoxArchive} /> {t(descriptionMapping.get(deployment.sourceType)!)}
        </span>
        <span>
          <FontAwesomeIcon className="h-4 w-4 ml-2"
                           icon={faRunning} /> {t(descriptionMapping.get(deployment.executionType)!)}
        </span>
      </div>
      <div className="w-5/12">
        <p>
          <FontAwesomeIcon className="h-4 w-4" icon={faHouse} /> {deployment.home}
        </p>
        <p className="pt-2">
          <FontAwesomeIcon className="h-4 w-4" icon={faFileCode} /> {deployment.resource}
        </p>
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`deployment-${deployment.id}`}>
          <ViewDropdownMenuItem link={`/system/deployments/view/${deployment.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
