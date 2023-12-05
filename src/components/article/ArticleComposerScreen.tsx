import { APIEnvironment } from "@/api-environment";
import { RenderedArticleModal } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, WideDataCell } from "@/components/common/DataRow";
import { OperationResultToast, ToastProperties } from "@/components/common/OperationResultToast";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { TabbedScreen } from "@/components/common/TabbedScreen";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Textarea } from "@/components/form/Textarea";
import { AwarenessLevel, PageOperationButton } from "@/components/navigation/OperationButton";
import { generateLinkByTitle } from "@/components/utility/generate-link";
import { toastHandler } from "@/components/utility/toast-handler";
import { articleComposerFacade } from "@/core/facade/article-composer-facade";
import { ArticleComposerCommonData, ArticleEditRequest, ArticleStatus } from "@/core/model/article";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { faFloppyDisk, faLink, faList, faUnlink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ArticleComposerScreenProps {
  environment: APIEnvironment;
  commonData: ArticleComposerCommonData;
  mutate?: KeyedMutator<ArticleComposerCommonData>;
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
  const { register, handleSubmit, formState: { errors } } = useForm<ArticleEditRequest>({
    defaultValues: {
      userID: getUserInfo().id,
      status: ArticleStatus.DRAFT,
      ...commonData.article
    }
  });
  const router = useRouter();
  const [generateLink, setGenerateLink] = useState(true);
  const [contentToRender, setContentToRender] = useState("");
  const [showToast, setShowToast] = useState<ToastProperties | null>(null);
  const { handleAxiosError } = toastHandler(setShowToast, t);

  const onSubmit: SubmitHandler<ArticleEditRequest> = (data) => {
    data = { ...data, tags: data.tags.map(id => parseInt(id as unknown as string)) };
    submitArticle(data, router.query.id as number | undefined)
      .then(articleID => {
        mutate && mutate();
        return articleID;
      })
      .then(articleID => router.push(`/articles/view/${articleID}`))
      .catch(handleAxiosError);
  }

  useEffect(() => {
    generateLinkByTitle(generateLink);
  }, [generateLink]);

  useEffect(() => {
    const init = async () => {
      const { Input, Select, initTE } = await import("tw-elements");
      initTE({ Input, Select }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("userID")} />
      <input type="hidden" {...register("status")} />
      <MultiPaneScreen>
        {showToast && <OperationResultToast key={`alert-${new Date().getTime()}`} {...showToast} />}
        <WidePane>
          <CardWithTitle title={commonData.article?.title ?? t("page.title.article.create")}>
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
                    <Select registerReturn={register("locale")} label={t("forms:article.edit.language")} optionMap={{
                      "HU": t("forms:article.edit.language.HU"),
                      "EN": t("forms:article.edit.language.EN")
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
            <RenderedArticleModal content={contentToRender} resourceServer={environment.resourceServer}
                                  onRender={() => {
                                    const sourceInput = document.getElementById("article-raw-content") as HTMLInputElement;
                                    setContentToRender(sourceInput.value);
                                  }} />
            <SubmitButton label={t("page-operations.common.save")} icon={faFloppyDisk}
                          awareness={AwarenessLevel.POSITIVE} />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </form>
  )
}
