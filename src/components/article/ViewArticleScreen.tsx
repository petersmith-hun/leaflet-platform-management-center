import { APIEnvironment } from "@/api-environment";
import { ArticleEnabledStatusFlag, ArticlePublishStatusFlag } from "@/components/article/ArticleStatusFlag";
import { RenderedArticle } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ToastType } from "@/components/common/OperationResultToast";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import {
  AwarenessLevel,
  ConfirmedOperationButton,
  OperationButton,
  PageOperationButton
} from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
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
import React, { ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ViewArticleScreenParameters {
  article: ResponseWrapper<ArticleModel>;
  environment: APIEnvironment;
  mutate: KeyedMutator<ResponseWrapper<ArticleModel>>;
}

/**
 * Article viewer screen component. Renders a static page with every information of the given article.
 *
 * @param article article data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewArticleScreen = ({ article, environment, mutate }: ViewArticleScreenParameters): ReactNode => {

  const { changeGeneralStatus, changePublicationStatus, deleteArticleByID } = articleService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { showCustomToast, showCustomErrorToast } = toastHandler(triggerToast, t);

  useEffect(() => {
    updatePageTitle(t("page.title.article.view"));
  }, []);

  const handleGeneralStatusChange = (article: ResponseWrapper<ArticleModel>): void => {

    setOperationInProgress(true);
    changeGeneralStatus(article.body.id)
      .then(_ => mutate())
      .then(currentArticle => showCustomToast(
        t("toast.article.title.success.updated"),
        t("toast.article.message.status", {
          title: article.body.title,
          status: t(currentArticle!.body.enabled ? "common.enabled" : "common.disabled")
        }),
        currentArticle!.body.enabled
          ? ToastType.SUCCESS
          : ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t("toast.article.title.failure"),
        t("toast.article.message.failure", {
          title: article.body.title
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  const handlePublicationStatusChange = (article: ResponseWrapper<ArticleModel>): void => {

    setOperationInProgress(true);
    changePublicationStatus(article.body.id, article.body.entryStatus)
      .then(_ => mutate())
      .then(currentArticle => showCustomToast(
        t("toast.article.title.success.updated"),
        t("toast.article.message.status", {
          title: article.body.title,
          status: t(`toast.article.message.status.publication.${currentArticle!.body.entryStatus}`)
        }),
        currentArticle!.body.entryStatus === ArticleStatus.PUBLIC
          ? ToastType.SUCCESS
          : ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t("toast.article.title.failure"),
        t("toast.article.message.failure", {
          title: article.body.title
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  const handleDeletion = (article: ResponseWrapper<ArticleModel>): void => {

    setOperationInProgress(true);
    deleteArticleByID(article.body.id)
      .then(_ => mutate())
      .then(_ => router.push("/articles"))
      .then(_ => showCustomToast(
        t("toast.article.title.success.updated"),
        t("toast.article.message.status", {
          title: article.body.title,
          status: t("common.deleted")
        }), ToastType.WARNING
      ))
      .catch(_ => showCustomErrorToast(
        t("toast.article.title.failure"),
        t("toast.article.message.failure", {
          title: article.body.title
        })
      ))
      .finally(() => setOperationInProgress(false));
  }

  return (
    <MultiPaneScreen>
      <WidePane>

        <CardWithTitle title={article.body.title}>
          <DataRow>
            <WideDataCell title={t("forms:article.edit.category")}>
              <OperationButton label={article.body.category.title} icon={faFolder}
                               link={`/categories/${article.body.category.id}`}
                               additionalClass="mt-2 w-6/12 inline-block" />
            </WideDataCell>
            <NarrowDataCell title={t("forms:article.edit.general-status")}>
              <ArticleEnabledStatusFlag article={article.body} />
            </NarrowDataCell>
            <NarrowDataCell title={t("forms:article.edit.publication-status")}>
              <ArticlePublishStatusFlag article={article.body} />
            </NarrowDataCell>
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:article.edit.title")} children={article.body.title} />
            <NarrowDataCell title={t("forms:article.edit.created-at")}
                            children={dateFormatter(article.body.created)} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:article.edit.link")}>
              <a target="_blank" href={`${environment.publicArticlePath}${article.body.link}`}>
                <FontAwesomeIcon className="mr-2" icon={faArrowUpRightFromSquare} />
                {article.body.link}
              </a>
            </WideDataCell>
            <NarrowDataCell title={t("forms:article.edit.last-modified-at")}
                            children={dateFormatter(article.body.lastModified) ?? t("article.label.never-modified")} />
          </DataRow>
          <DataRow>
            <WideDataCell title={t("forms:article.edit.language")}
                          children={t(`forms:article.edit.language.${article.body.locale}`)} />
            <NarrowDataCell title={t("forms:article.edit.published-at")}
                            children={dateFormatter(article.body.published) ?? t("article.label.not-published")} />
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:article.edit.prologue")}>
              <p className="blockquote text-neutral-300">{article.body.prologue}</p>
            </FullWidthDataCell>
          </DataRow>
        </CardWithTitle>

        <CardWithTitle title={t("page.sub-title.article.seo")}>
          <DataRow>
            <WideDataCell title={t("forms:article.edit.seo.title")} children={article.seo.metaTitle} />
            <NarrowDataCell title={t("forms:article.edit.seo.keywords")}
                            children={article.seo.metaKeywords || t("article.label.seo-keywords-none-specified")} />
          </DataRow>
          <DataRow>
            <FullWidthDataCell title={t("forms:article.edit.seo.description")}>
              <p className="blockquote text-neutral-300">{article.seo.metaDescription}</p>
            </FullWidthDataCell>
          </DataRow>
        </CardWithTitle>

        <div id="rendered-markdown-content" className="max-w-7xl">
          <CardWithTitle title={t("page.sub-title.article.rendered-content")} resizable={"rendered-markdown-content"}>
            <DataRow>
              <RenderedArticle content={article.body.rawContent} resourceServer={environment.resourceServer} />
            </DataRow>
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
