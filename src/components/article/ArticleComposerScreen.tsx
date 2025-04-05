import { APIEnvironment } from "@/api-environment";
import { RenderArticleButton, RenderedArticle } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { Modal } from "@/components/common/Modal";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { TabbedScreen } from "@/components/common/TabbedScreen";
import { AutoSaved, SubmitListener } from "@/components/form/autosaved/AutoSaved";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { generateLinkByTitle } from "@/components/utility/generate-link";
import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { articleComposerFacade } from "@/core/facade/article-composer-facade";
import { ArticleComposerCommonData, ArticleEditRequest, ArticleStatus } from "@/core/model/article";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { faEye, faLink, faList, faUnlink, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ArticleComposerScreenProps {
  environment: APIEnvironment;
  commonData: ArticleComposerCommonData;
  mutate?: KeyedMutator<ArticleComposerCommonData>;
}

const FilesUnavailableNotification = ({ commonData }: { commonData: ArticleComposerCommonData }): ReactNode => {

  const { t } = useTranslation();

  if (commonData.filesAvailable) {
    return;
  }

  return (
    <div
      className={`w-full items-center rounded-lg px-6 py-2 mb-2 text-base bg-danger-100 text-danger-700 dark:bg-danger-950 dark:text-danger-500/80"`}
      role="alert"
      id="alert-autosave-status"
      data-twe-alert-init="">
      <FontAwesomeIcon icon={faWarning} className="mr-1" /> {t("article.label.files-unavailable")}
    </div>
  )
}

/**
 * Screen used by article manager's create/edit operations. For editing purpose, provide the article itself in the
 * common data parameter, as well as an SWR mutate function to invalidate the common data cache for the edited article.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param commonData pre-loaded form data (categories, tags, files)
 * @param mutate SWR mutate function for data invalidation
 */
export const ArticleComposerScreen = ({ environment, commonData, mutate }: ArticleComposerScreenProps): ReactNode => {

  const { submitArticle } = articleComposerFacade(environment);
  const { getUserInfo } = useSessionHelper();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<ArticleEditRequest>({
    defaultValues: {
      userID: getUserInfo().id,
      status: ArticleStatus.DRAFT,
      ...commonData.article
    }
  });
  const router = useRouter();
  const [generateLink, setGenerateLink] = useState(true);
  const [contentToRender, setContentToRender] = useState("");
  const articleID = router.query.id as number | undefined;
  const submitListener = useMemo(() => new SubmitListener(router), []);

  const renderArticle = (): void => {
    const sourceInput = document.getElementById("article-raw-content") as HTMLInputElement;
    setContentToRender(sourceInput.value);
  }

  useEffect(() => {
    generateLinkByTitle(generateLink);
  }, [generateLink]);

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Input, TWElement.Select]));
  }, []);

  return (
    <SubmitOperation domain={"article"} mutate={mutate} titleSupplier={article => article.title}
                     handleSubmit={handleSubmit}
                     serviceCall={article => {
                       submitListener.submitted();
                       return submitArticle(article, articleID);
                     }}>
      <input type="hidden" {...register("userID")} />
      <input type="hidden" {...register("status")} />
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={commonData.article?.title ?? t("page.title.article.create")}>
            <FilesUnavailableNotification commonData={commonData} />
            <AutoSaved getValues={getValues} reset={reset} submitListener={submitListener} />
            <TabbedScreen
              titles={[
                t("tab.article.create.base"),
                t("tab.article.create.seo"),
                t("tab.article.create.content"),
                t("tab.article.create.tags-attachments"),
              ]}>
              <div>
                <DataRow>
                  <WideDataCell>
                    <Select registerReturn={register("categoryID")} label={t("forms:article.edit.category")}
                            optionMap={commonData.categories} />
                  </WideDataCell>
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
                           label={t("forms:article.edit.title")} id={"article-title"}
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
                               label={t("forms:article.edit.link")} id={"article-link"}
                               readonly={generateLink}
                               errorSupplier={() => errors.link?.message} />
                      </div>
                    </div>
                  </WideDataCell>
                </DataRow>
                <DataRow>
                  <FullWidthDataCell>
                    <Textarea registerReturn={register("prologue", { required: t("forms:validation.common.required") })}
                              label={t("forms:article.edit.prologue")}
                              id={"article-prologue"}
                              errorSupplier={() => errors.prologue?.message} />
                  </FullWidthDataCell>
                </DataRow>
              </div>
              <div>
                <DataRow>
                  <WideDataCell>
                    <Input registerReturn={register("metaTitle", { required: t("forms:validation.common.required") })}
                           label={t("forms:article.edit.seo.title")}
                           id={"article-seo-title"}
                           errorSupplier={() => errors.metaTitle?.message} />
                  </WideDataCell>
                  <WideDataCell>
                    <Input registerReturn={register("metaKeywords")} label={t("forms:article.edit.seo.keywords")}
                           id={"article-seo-keywords"} />
                  </WideDataCell>
                </DataRow>
                <DataRow>
                  <FullWidthDataCell>
                    <Textarea
                      registerReturn={register("metaDescription", { required: t("forms:validation.common.required") })}
                      label={t("forms:article.edit.seo.description")}
                      id={"article-seo-description"}
                      errorSupplier={() => errors.metaDescription?.message} />
                  </FullWidthDataCell>
                </DataRow>
              </div>
              <div>
                <DataRow>
                  <FullWidthDataCell>
                    <Textarea
                      registerReturn={register("rawContent", { required: t("forms:validation.common.required") })}
                      label={t("forms:article.edit.raw-content")}
                      id={"article-raw-content"}
                      defaultRowCount={50}
                      errorSupplier={() => errors.rawContent?.message} />
                  </FullWidthDataCell>
                </DataRow>
              </div>
              <div>
                <DataRow>
                  <WideDataCell>
                    <Select registerReturn={register("tags")} label={t("forms:article.edit.tags")}
                            optionMap={commonData.tags} multiple={true} search={true} />
                  </WideDataCell>
                  <WideDataCell>
                    <Select registerReturn={register("attachments")} label={t("forms:article.edit.attachments")}
                            optionMap={commonData.files} multiple={true} search={true} />
                  </WideDataCell>
                </DataRow>
              </div>
            </TabbedScreen>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.article")}>
            <PageOperationButton label={t("page-operations.article.back-to-articles")} icon={faList}
                                 link={"/articles"} />
            {articleID && <PageOperationButton label={t("page-operations.article.view")} icon={faEye}
                                               link={`/articles/view/${articleID}`} />}
            <RenderArticleButton onClick={renderArticle} />
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
