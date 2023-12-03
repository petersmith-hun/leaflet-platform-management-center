import { APIEnvironment } from "@/api-environment";
import { RenderedArticleModal } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { OperationResultToast, ToastProperties } from "@/components/common/OperationResultToast";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Separator } from "@/components/common/Separator";
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

// TODO extract these to a separate component
const DataRow = ({ children }: { children: ReactNode | ReactNode[] }): ReactNode => {

  return (
    <>
      <div className="flex flex-row">
        {children}
      </div>
      <Separator thick={false} />
    </>
  )
}

const DataCell = ({ widthClass, title, children }: {
  widthClass: "w-3/12" | "w-6/12" | "w-full",
  title?: string,
  children: string | ReactNode
}): ReactNode => {

  return (
    <div className={widthClass}>
      {title && (
        <>
          <b>{title}</b>
          <br />
        </>
      )}
      {children}
    </div>
  );
}

const NarrowDataCell = ({ title, children }: { title?: string, children: string | ReactNode }): ReactNode => {
  return <DataCell widthClass={"w-3/12"} title={title} children={children} />
}

const WideDataCell = ({ title, children }: { title?: string, children: string | ReactNode }): ReactNode => {
  return <DataCell widthClass={"w-6/12"} title={title} children={children} />
}

const FullWidthDataCell = ({ title, children }: { title?: string, children: string | ReactNode }): ReactNode => {
  return <DataCell widthClass={"w-full"} title={title} children={children} />
}

/**
 * TODO.
 *
 * @param environment
 * @param commonData
 */
export const ArticleComposerScreen = ({ environment, commonData }: {
  environment: APIEnvironment,
  commonData: ArticleComposerCommonData
}): ReactNode => {

  const { submitArticle } = articleComposerFacade(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<ArticleEditRequest>();
  const router = useRouter();
  const [generateLink, setGenerateLink] = useState(true);
  const [contentToRender, setContentToRender] = useState("");
  const [showToast, setShowToast] = useState<ToastProperties | null>(null);
  const { handleErrorResponse } = toastHandler(setShowToast, t);
  const { getUserInfo } = useSessionHelper();

  const onSubmit: SubmitHandler<ArticleEditRequest> = (data) => {
    submitArticle(data)
      .then(articleID => router.push(`/articles/view/${articleID}`))
      .catch(handleErrorResponse);
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
      <input type="hidden" {...register("userID")} value={getUserInfo().id} />
      <input type="hidden" {...register("status")} value={ArticleStatus.DRAFT} />
      <MultiPaneScreen>
        {showToast && <OperationResultToast key={`alert-${new Date().getTime()}`} {...showToast} />}
        <WidePane>
          <CardWithTitle title={t("page.title.article.create")}>
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
                              errorSupplier={() => errors.prologue?.message}/>
                  </FullWidthDataCell>
                </DataRow>
              </div>
              <div>
                <DataRow>
                  <WideDataCell>
                    <Input registerReturn={register("metaTitle", { required: t("forms:validation.common.required") })}
                           label={t("forms:article.edit.seo.title")}
                           id={"article-seo-title"}
                           errorSupplier={() => errors.metaTitle?.message}/>
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
                      errorSupplier={() => errors.metaDescription?.message}/>
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
                      errorSupplier={() => errors.rawContent?.message}/>
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
