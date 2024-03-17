import { APIEnvironment } from "@/api-environment";
import { RenderArticleButton, RenderedArticle } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { Modal } from "@/components/common/Modal";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { TabbedScreen } from "@/components/common/TabbedScreen";
import { AutoSaved, SubmitListener } from "@/components/form/AutoSaved";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { generateLinkByTitle } from "@/components/utility/generate-link";
import { convertDocumentToEditRequest } from "@/core/converters/documents";
import { ResponseWrapper } from "@/core/model/common";
import { DocumentEditRequest, DocumentModel } from "@/core/model/document";
import documentService from "@/core/service/document-service";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { faEye, faLink, faList, faUnlink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface DocumentComposerScreenProps {
  environment: APIEnvironment;
  document?: ResponseWrapper<DocumentModel>;
  mutate?: KeyedMutator<ResponseWrapper<DocumentModel>>;
}

/**
 * Screen used by document manager's create/edit operations. For editing purpose, provide the document itself, as well
 * as an SWR mutate function to invalidate the cache for the edited document.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param document document data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const DocumentComposerScreen = ({ environment, document, mutate }: DocumentComposerScreenProps): ReactNode => {

  const { createDocument, updateDocument } = documentService(environment);
  const { getUserInfo } = useSessionHelper();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<DocumentEditRequest>({
    defaultValues: {
      userID: getUserInfo().id,
      ...(document ? convertDocumentToEditRequest(document) : undefined)
    }
  });
  const router = useRouter();
  const [generateLink, setGenerateLink] = useState(true);
  const [contentToRender, setContentToRender] = useState("");
  const documentID = router.query.id as number | undefined;
  const submitListener = useMemo(() => new SubmitListener(), []);

  const renderDocument = (): void => {
    const sourceInput = global.document.getElementById("document-raw-content") as HTMLInputElement;
    setContentToRender(sourceInput.value);
  };

  useEffect(() => {
    generateLinkByTitle(generateLink);
  }, [generateLink]);

  return (
    <SubmitOperation domain={"document"} mutate={mutate}
                     titleSupplier={document => document.title}
                     handleSubmit={handleSubmit}
                     serviceCall={document => {
                       submitListener.submitted();
                       return documentID
                         ? updateDocument(documentID, document)
                         : createDocument(document);
                     }}>
      <input type="hidden" {...register("userID")} />
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={document?.body.title ?? t("page.title.document.create")}>
            <AutoSaved getValues={getValues} reset={reset} submitListener={submitListener} />
            <TabbedScreen
              titles={[
                t("tab.document.create.base"),
                t("tab.document.create.seo"),
                t("tab.document.create.content")
              ]}>
              <div>
                <DataRow>
                  <WideDataCell>
                    <Select registerReturn={register("locale")} label={t("forms:common.edit.language")} optionMap={{
                      "HU": t("forms:common.edit.language.HU"),
                      "EN": t("forms:common.edit.language.EN")
                    }} />
                  </WideDataCell>
                </DataRow>
                <DataRow>
                  <WideDataCell>
                    <Input registerReturn={register("title", { required: t("forms:validation.common.required") })}
                           label={t("forms:document.edit.title")} id={"article-title"}
                           errorSupplier={() => errors.title?.message} />
                  </WideDataCell>
                  <WideDataCell>
                    <div className="flex flex-row">
                      <button type="button"
                              className="w-9 h-9 mr-2 rounded border-2 px-2 py-1 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10"
                              onClick={() => setGenerateLink(!generateLink)}>
                        <FontAwesomeIcon icon={generateLink ? faLink : faUnlink} />
                      </button>
                      <div className="flex-grow">
                        <Input registerReturn={register("link", { required: t("forms:validation.common.required") })}
                               label={t("forms:document.edit.link")} id={"article-link"}
                               readonly={generateLink}
                               errorSupplier={() => errors.link?.message} />
                      </div>
                    </div>
                  </WideDataCell>
                </DataRow>
              </div>
              <div>
                <DataRow>
                  <WideDataCell>
                    <Input registerReturn={register("metaTitle", { required: t("forms:validation.common.required") })}
                           label={t("forms:document.edit.seo.title")}
                           id={"document-seo-title"}
                           errorSupplier={() => errors.metaTitle?.message} />
                  </WideDataCell>
                  <WideDataCell>
                    <Input registerReturn={register("metaKeywords")} label={t("forms:document.edit.seo.keywords")}
                           id={"document-seo-keywords"} />
                  </WideDataCell>
                </DataRow>
                <DataRow>
                  <FullWidthDataCell>
                    <Textarea
                      registerReturn={register("metaDescription", { required: t("forms:validation.common.required") })}
                      label={t("forms:document.edit.seo.description")}
                      id={"document-seo-description"}
                      errorSupplier={() => errors.metaDescription?.message} />
                  </FullWidthDataCell>
                </DataRow>
              </div>
              <div>
                <DataRow>
                  <FullWidthDataCell>
                    <Textarea
                      registerReturn={register("rawContent", { required: t("forms:validation.common.required") })}
                      label={t("forms:document.edit.raw-content")}
                      id={"document-raw-content"}
                      defaultRowCount={50}
                      errorSupplier={() => errors.rawContent?.message} />
                  </FullWidthDataCell>
                </DataRow>
              </div>
            </TabbedScreen>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.document")}>
            <PageOperationButton label={t("page-operations.document.back-to-documents")} icon={faList}
                                 link={"/documents"} />
            {documentID && <PageOperationButton label={t("page-operations.document.view")} icon={faEye}
                                                link={`/documents/view/${documentID}`} />}
            <RenderArticleButton onClick={renderDocument} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
        <Modal id={"article-render-modal"} title={t("modal.title.rendered-article")}>
          <RenderedArticle content={contentToRender} resourceServer={environment.resourceServer} />
        </Modal>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
