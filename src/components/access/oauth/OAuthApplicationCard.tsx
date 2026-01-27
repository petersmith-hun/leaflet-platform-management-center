import { OAuthApplicationTypeIcon } from "@/components/access/oauth/OAuthApplicationTypeIcon";
import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { OAuthApplicationSummaryModel } from "@/core/model/oauth";
import { faAsterisk, faEdit, faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { ReactNode } from "react";

interface OAuthApplicationCardProps {
  application: OAuthApplicationSummaryModel;
}

/**
 * Renders an OAuth application card to be shown on the OAuth application manager's list view.
 *
 * @param application application data to be rendered
 */
export const OAuthApplicationCard = ({ application }: OAuthApplicationCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/access/oauth-applications/view/${application.id}`} className="text-primary-400 hover:text-primary-200">
            {application.name}
          </Link>
          <Separator thick={false} />
          <span className="text-xs">
            <FontAwesomeIcon className="h-4 w-4" icon={faFingerprint} /> {application.clientID}
          </span>
        </h5>
      </div>
      <div className="w-1/12 text-center">
        <OAuthApplicationTypeIcon item={application} />
      </div>
      <div className="w-1/12 text-center">
        <ItemEnabledStatusFlag item={application} />
      </div>
      <div className="w-3/12 text-sm text-neutral-300 text-right">
        <FormattedArticleDate date={application.created} icon={faEdit} />
        <FormattedArticleDate date={application.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`application-${application.id}`}>
          <ViewDropdownMenuItem link={`/access/oauth-applications/view/${application.id}`} />
          <EditDropdownMenuItem link={`/access/oauth-applications/edit/${application.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
