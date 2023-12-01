import { APIEnvironment } from "@/api-environment";
import { ArticleEnabledStatusFlag, ArticlePublishStatusFlag } from "@/components/article/ArticleCard";
import { RenderedArticle } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { OperationResultToast, ToastProperties, ToastType } from "@/components/common/OperationResultToast";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Separator } from "@/components/common/Separator";
import {
  AwarenessLevel,
  ConfirmedOperationButton,
  OperationButton,
  PageOperationButton
} from "@/components/navigation/OperationButton";
import { ArticleModel, ArticleStatus } from "@/core/model/article";
import { ResponseWrapper } from "@/core/model/common";
import articleService from "@/core/service/article-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { PageContext } from "@/pages/_app";
import {
  faArrowUpRightFromSquare,
  faBan,
  faCommenting,
  faDownload,
  faEye,
  faFolder,
  faGlobe,
  faList,
  faPencil,
  faTag,
  faToggleOff,
  faToggleOn
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewArticleScreenParameters {
  article: ResponseWrapper<ArticleModel>;
  environment: APIEnvironment;
  mutate: KeyedMutator<ResponseWrapper<ArticleModel>>;
}

const ArticleDataRow = ({ children }: { children: ReactNode | ReactNode[] }): ReactNode => {

  return (
    <>
      <div className="flex flex-row">
        {children}
      </div>
      <Separator thick={false} />
    </>
  )
}

const ArticleDataCell = ({ widthClass, title, children }: {
  widthClass: "w-3/12" | "w-6/12" | "w-12/12",
  title: string,
  children: string | ReactNode
}): ReactNode => {

  return (
    <div className={widthClass}>
      <b>{title}</b>
      <br />
      {children}
    </div>
  );
}

const NarrowArticleDataCell = ({ title, children }: { title: string, children: string | ReactNode }): ReactNode => {
  return <ArticleDataCell widthClass={"w-3/12"} title={title} children={children} />
}

const WideArticleDataCell = ({ title, children }: { title: string, children: string | ReactNode }): ReactNode => {
  return <ArticleDataCell widthClass={"w-6/12"} title={title} children={children} />
}

const FullWidthArticleDataCell = ({ title, children }: { title: string, children: string | ReactNode }): ReactNode => {
  return <ArticleDataCell widthClass={"w-12/12"} title={title} children={children} />
}

/**
 * TODO.
 *
 * @param data
 */
export const ViewArticleScreen = ({ article, environment, mutate }: ViewArticleScreenParameters): ReactNode => {

  const { changeGeneralStatus, changePublicationStatus, deleteArticleByID } = articleService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const [showToast, setShowToast] = useState<ToastProperties | null>(null);

  useEffect(() => {
    updatePageTitle(t("page.title.article.view"));
  }, []);

  const handleGeneralStatusChange = (article: ResponseWrapper<ArticleModel>): void => {

    changeGeneralStatus(article.body.id)
      .then(_ => mutate())
      .then(currentArticle => setShowToast({
        type: currentArticle!.body.enabled
          ? ToastType.SUCCESS
          : ToastType.WARNING,
        title: t("toast.article.title.success"),
        message: t("toast.article.message.status", {
          title: article.body.title,
          status: t(currentArticle!.body.enabled ? "common.enabled" : "common.disabled")
        })
      }))
      .catch(_ => setShowToast({
        type: ToastType.ERROR,
        title: t("toast.article.title.failure"),
        message: t("toast.article.message.failure", {
          title: article.body.title
        })
      }));
  }

  const handlePublicationStatusChange = (article: ResponseWrapper<ArticleModel>): void => {

    changePublicationStatus(article.body.id, article.body.entryStatus)
      .then(_ => mutate())
      .then(currentArticle => setShowToast({
        type: currentArticle!.body.entryStatus === ArticleStatus.PUBLIC
          ? ToastType.SUCCESS
          : ToastType.WARNING,
        title: t("toast.article.title.success"),
        message: t("toast.article.message.status", {
          title: article.body.title,
          status: t(`toast.article.message.status.publication.${currentArticle!.body.entryStatus}`)
        })
      }))
      .catch(_ => setShowToast({
        type: ToastType.ERROR,
        title: t("toast.article.title.failure"),
        message: t("toast.article.message.failure", {
          title: article.body.title
        })
      }));
  }

  const handleDeletion = (article: ResponseWrapper<ArticleModel>): void => {
    deleteArticleByID(article.body.id)
      .then(_ => mutate())
      .then(_ => router.push("/articles"));
  }

  return (
    <MultiPaneScreen>
      {showToast && <OperationResultToast key={`alert-${new Date().getTime()}`} {...showToast} />}
      <WidePane>

        <CardWithTitle title={article.body.title}>
          <ArticleDataRow>
            <WideArticleDataCell title={t("forms:article.edit.category")}>
              <OperationButton label={article.body.category.title} icon={faFolder}
                               link={`/categories/${article.body.category.id}`}
                               additionalClass="mt-2 w-6/12 inline-block" />
            </WideArticleDataCell>
            <NarrowArticleDataCell title={t("forms:article.edit.general-status")}>
              <ArticleEnabledStatusFlag {...article.body} />
            </NarrowArticleDataCell>
            <NarrowArticleDataCell title={t("forms:article.edit.publication-status")}>
              <ArticlePublishStatusFlag {...article.body} />
            </NarrowArticleDataCell>
          </ArticleDataRow>
          <ArticleDataRow>
            <WideArticleDataCell title={t("forms:article.edit.title")} children={article.body.title} />
            <NarrowArticleDataCell title={t("forms:article.edit.created-at")}
                                   children={dateFormatter(article.body.created)} />
          </ArticleDataRow>
          <ArticleDataRow>
            <WideArticleDataCell title={t("forms:article.edit.link")}>
              <a target="_blank" href={`${environment.publicArticlePath}${article.body.link}`}>
                <FontAwesomeIcon className="mr-2" icon={faArrowUpRightFromSquare} />
                {article.body.link}
              </a>
            </WideArticleDataCell>
            <NarrowArticleDataCell title={t("forms:article.edit.last-modified-at")}
                                   children={dateFormatter(article.body.lastModified) ?? t("article.label.never-modified")} />
          </ArticleDataRow>
          <ArticleDataRow>
            <WideArticleDataCell title={t("forms:article.edit.language")}
                                 children={t(`forms:article.edit.language.${article.body.locale}`)} />
            <NarrowArticleDataCell title={t("forms:article.edit.published-at")}
                                   children={dateFormatter(article.body.published) ?? t("article.label.not-published")} />
          </ArticleDataRow>
          <ArticleDataRow>
            <FullWidthArticleDataCell title={t("forms:article.edit.prologue")}>
              <p className="blockquote text-neutral-300">{article.body.prologue}</p>
            </FullWidthArticleDataCell>
          </ArticleDataRow>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.article.seo")}>
          <ArticleDataRow>
            <WideArticleDataCell title={t("forms:article.edit.seo.title")} children={article.seo.metaTitle} />
            <NarrowArticleDataCell title={t("forms:article.edit.seo.keywords")}
                                   children={article.seo.metaKeywords || t("article.label.seo-keywords-none-specified")} />
          </ArticleDataRow>
          <ArticleDataRow>
            <FullWidthArticleDataCell title={t("forms:article.edit.seo.description")}>
              <p className="blockquote text-neutral-300">{article.seo.metaDescription}</p>
            </FullWidthArticleDataCell>
          </ArticleDataRow>
        </CardWithTitle>

        <div id="rendered-markdown-content" className="max-w-7xl">
          <CardWithTitle title={t("page.sub-title.article.rendered-content")} resizable={"rendered-markdown-content"}>
            <ArticleDataRow>
              <RenderedArticle content={article.body.rawContent} resourceServer={environment.resourceServer} />
            </ArticleDataRow>
          </CardWithTitle>
        </div>

        <CardWithTitle title={t("page.sub-title.article.tags")}>
          <div className="flex flex-row">
            {article.body.tags.map(tag =>
              <OperationButton key={`tag-${tag.id}`} label={tag.name} icon={faTag} link={`/tags/view/${tag.id}`} />
            )}
          </div>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.article.attachments")}>
          <div className="flex flex-row">
            {article.body.attachments.map(file =>
              <OperationButton key={`attachment-${file.reference}`} label={file.originalFilename} icon={faDownload}
                               link={`/files/view/${file.reference}`} />
            )}
          </div>
        </CardWithTitle>

      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.article")}>
          <PageOperationButton label={t("page-operations.article.handle-comments")} icon={faCommenting}
                               link={`/comments/${article.body.id}`} />
          <PageOperationButton label={t("page-operations.article.edit")} icon={faPencil}
                               link={`/articles/edit/${article.body.id}`} />
          <PageOperationButton label={t("page-operations.article.back-to-articles")} icon={faList} link={"/articles"} />
          {article.body.enabled &&
						<ConfirmedOperationButton label={t("page-operations.article.disable")} icon={faToggleOff}
																			id={`article-general-status-${article.body.id}`}
																			onSubmit={() => handleGeneralStatusChange(article)}
																			awareness={AwarenessLevel.ALERT} />}
          {!article.body.enabled &&
						<ConfirmedOperationButton label={t("page-operations.article.enable")} icon={faToggleOn}
																			id={`article-general-status-${article.body.id}`}
																			onSubmit={() => handleGeneralStatusChange(article)}
																			awareness={AwarenessLevel.POSITIVE} />}
          {article.body.entryStatus === ArticleStatus.PUBLIC &&
						<ConfirmedOperationButton label={t("page-operations.article.unpublish")} icon={faBan}
																			id={`article-publication-${article.body.id}`}
																			onSubmit={() => handlePublicationStatusChange(article)}
																			awareness={AwarenessLevel.ALERT} />}
          {article.body.entryStatus === ArticleStatus.REVIEW &&
						<ConfirmedOperationButton label={t("page-operations.article.publish")} icon={faGlobe}
																			id={`article-publication-${article.body.id}`}
																			onSubmit={() => handlePublicationStatusChange(article)}
																			awareness={AwarenessLevel.POSITIVE} />}
          {article.body.entryStatus === ArticleStatus.DRAFT &&
						<ConfirmedOperationButton label={t("page-operations.article.request-review")} icon={faEye}
																			id={`article-publication-${article.body.id}`}
																			onSubmit={() => handlePublicationStatusChange(article)}
																			awareness={AwarenessLevel.WARNING} />}
          <ConfirmedOperationButton label={t("page-operations.article.delete")} icon={faPencil}
                                    id={`article-delete-${article.body.id}`}
                                    onSubmit={() => handleDeletion(article)}
                                    awareness={AwarenessLevel.ALERT} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
