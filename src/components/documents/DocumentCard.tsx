import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DropdownMenu, EditDropdownMenuItem, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { DocumentModel } from "@/core/model/document";
import { faAsterisk, faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { ReactNode } from "react";

interface DocumentCardProps {
  document: DocumentModel;
}

/**
 * Renders a document card to be shown on the document manager's list view.
 *
 * @param document document data to be rendered
 */
export const DocumentCard = ({ document }: DocumentCardProps): ReactNode => {

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`documents/view/${document.id}`} className="text-primary-400 hover:text-primary-200">
            {document.title}
          </Link>
        </h5>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={document.created} icon={faEdit} />
        <FormattedArticleDate date={document.lastModified} icon={faAsterisk} />
      </div>
      <div className="w-2/12 text-center">
        <ItemEnabledStatusFlag item={document} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`document-${document.id}`}>
          <ViewDropdownMenuItem link={`documents/view/${document.id}`} />
          <EditDropdownMenuItem link={`documents/edit/${document.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
