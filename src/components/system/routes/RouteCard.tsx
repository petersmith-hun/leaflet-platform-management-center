import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { FrontEndRouteDataModel } from "@/core/model/routes";
import { faAsterisk, faEdit, faLocationArrow, faRoute, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface RouteCardProps {
  route: FrontEndRouteDataModel;
}

/**
 * Renders a card in the route list displaying the summary of a route.
 *
 * @param route route data to be rendered
 */
export const RouteCard = ({ route }: RouteCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard>
      <div className="w-4/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`routes/view/${route.id}`} className="text-primary-400 hover:text-primary-200">
            {route.name} <span className="text-xs text-neutral-400">[{route.sequenceNumber}] </span>
          </Link>
        </h5>
        <Separator thick={false} />
        <FontAwesomeIcon icon={faRoute} /> {route.url}
      </div>
      <div className="w-3/12 text-sm text-neutral-300 flex flex-col">
        <span>
          <FontAwesomeIcon className="w-4 h-4" icon={faLocationArrow} /> {t(`forms:route.edit.type.${route.type}`)}
        </span>
        <span>
          <FontAwesomeIcon className="w-4 h-4" icon={faUserShield} /> {t(`forms:route.edit.auth-requirement.${route.authRequirement}`)}
        </span>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={route.created} icon={faEdit} />
        <FormattedArticleDate date={route.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-1/12 text-center">
        <ItemEnabledStatusFlag item={route} />
      </div>
      <div className="w-1/12 flex flex-col items-end">
        <DropdownMenu id={`route-${route.id}`}>
          <ViewDropdownMenuItem link={`routes/view/${route.id}`} />
          <EditDropdownMenuItem link={`routes/edit/${route.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
