import { ScreenParameters } from "@/api-environment";
import { PageOperationCard } from "@/components/common/Cards";
import { ItemListBody, ItemListHeader, ItemListHeaderItem, ItemListPane } from "@/components/common/ItemListPane";
import { MultiPaneScreen, NarrowPane } from "@/components/common/ScreenLayout";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { noOpPagination } from "@/core/model/common";
import { DocumentModel } from "@/core/model/document";
import documentService from "@/core/service/document-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface DocumentListResultProps {
  documents: DocumentModel[];
}

const DocumentListResult = ({ documents }: DocumentListResultProps ): ReactNode => {

  return (
    <ItemListPane pagination={noOpPagination}>
      <ItemListHeader>
        <ItemListHeaderItem titleKey={"header.document.title"} widthClass={"w-5/12"} />
        <ItemListHeaderItem titleKey={"header.document.dates"} widthClass={"w-3/12"} />
        <ItemListHeaderItem titleKey={"header.document.status"} widthClass={"w-2/12"} />
        <ItemListHeaderItem titleKey={"header.document.operations"} widthClass={"w-2/12"} />
      </ItemListHeader>
      <ItemListBody data={documents}>
        {(document: DocumentModel) => <DocumentCard key={`document-${document.id}`} document={document} />}
      </ItemListBody>
    </ItemListPane>
  )
}

/**
 * Main screen of document manager.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const DocumentListScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { t } = useTranslation();
  const { getAllDocuments } = documentService(environment);
  const { isLoading, data, error } = useSWR(swrNumberKey("documents", "all"), () => getAllDocuments());

  return (
    <MultiPaneScreen>
      <SWRManagedScreen isLoading={isLoading} error={error}>
        {() => <DocumentListResult documents={data!} />}
      </SWRManagedScreen>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.document")}>
          <PageOperationButton label={t("page-operations.document.new")} icon={faEdit} link="/documents/create" />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
