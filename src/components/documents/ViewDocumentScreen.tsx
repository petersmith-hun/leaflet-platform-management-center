import { APIEnvironment } from "@/api-environment";
import { RenderedArticle } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { ResponseWrapper } from "@/core/model/common";
import { DocumentModel } from "@/core/model/document";
import documentService from "@/core/service/document-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

/**
 * Parameters of operations available through the view document screen.
 */
export interface ViewDocumentScreenParameters {
  document: ResponseWrapper<DocumentModel>;
  environment: APIEnvironment;
  mutate: KeyedMutator<ResponseWrapper<DocumentModel>>;
}

/**
 * Document viewer screen component. Renders a static page with every information of the given document.
 *
 * @param document document data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewDocumentScreen = ({ document, environment, mutate }: ViewDocumentScreenParameters): ReactNode => {

  const { changeGeneralStatus, deleteDocumentByID } = documentService(environment);
  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>

        <CardWithTitle title={document.body.title}>
          <DataRow>
            <WideDataCell title={t("forms:document.edit.title")} children={document.body.title} />
            <NarrowDataCell title={t("forms:document.edit.created-at")}
                            children={dateFormatter(document.body.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:document.edit.link")}>
              {document.body.link}
            </WideDataCell>
            <NarrowDataCell title={t("forms:document.edit.last-modified-at")}
                            children={dateFormatter(document.body.lastModified) ?? t("document.label.never-modified")} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:common.edit.language")}
                          children={t(`forms:common.edit.language.${document.body.locale}`)} />
            <NarrowDataCell title={t("forms:document.edit.general-status")}>
              <ItemEnabledStatusFlag item={document.body} />
            </NarrowDataCell>
          </DataRow>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.document.seo")}>
          <DataRow>
            <WideDataCell title={t("forms:document.edit.seo.title")} children={document.seo.metaTitle} />
            <NarrowDataCell title={t("forms:document.edit.seo.keywords")}
                            children={document.seo.metaKeywords || t("document.label.seo-keywords-none-specified")} />
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:document.edit.seo.description")}>
              <p className="blockquote text-neutral-300">{document.seo.metaDescription}</p>
            </FullWidthDataCell>
          </DataRow>
        </CardWithTitle>

        <div id="rendered-markdown-content" className="max-w-7xl">
          <CardWithTitle title={t("page.sub-title.document.rendered-content")} resizable={"rendered-markdown-content"}>
            <DataRow>
              <RenderedArticle content={document.body.rawContent} resourceServer={environment.resourceServer} />
            </DataRow>
          </CardWithTitle>
        </div>

      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.document")}>
          <PageOperationButton label={t("page-operations.document.edit")} icon={faPencil}
                               link={`/documents/edit/${document.body.id}`} />
          <PageOperationButton label={t("page-operations.document.back-to-documents")} icon={faList}
                               link={"/documents"} />
          <GeneralStatusUpdateOperation domain={"document"} entity={document.body}
                                        titleSupplier={document => document.title}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <DeleteOperation domain={"document"} entity={document.body} titleSupplier={document => document.title}
                           serviceCall={deleteDocumentByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
