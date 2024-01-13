import { ArticlePublishStatusFlag } from "@/components/article/ArticleStatusFlag";
import { ViewArticleScreenParameters } from "@/components/article/index";
import { ArticlePublicationStatusUpdate } from "@/components/article/operations/ArticlePublicationStatusUpdate";
import { RenderedArticle } from "@/components/article/RenderedArticle";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell, NarrowDataCell, WideDataCell } from "@/components/common/DataRow";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { DeleteOperation } from "@/components/common/operations/DeleteOperation";
import { GeneralStatusUpdateOperation } from "@/components/common/operations/GeneralStatusUpdateOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { AwarenessLevel, OperationButton, PageOperationButton } from "@/components/navigation/OperationButton";
import { ArticleModel } from "@/core/model/article";
import articleService from "@/core/service/article-service";
import { dateFormatter } from "@/core/util/date-formatter";
import { PageContext } from "@/pages/_app";
import {
  faArrowUpRightFromSquare,
  faCommenting,
  faDownload,
  faFolder,
  faList,
  faPencil,
  faTag
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

const getHandleCommentButtonSuffix = (article: ArticleModel): string => {

  return article.pendingCommentCount
    ? ` (${article.pendingCommentCount})`
    : "";
}

/**
 * Article viewer screen component. Renders a static page with all information of the given article.
 *
 * @param article article data to be rendered
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const ViewArticleScreen = ({ article, environment, mutate }: ViewArticleScreenParameters): ReactNode => {

  const { changeGeneralStatus, deleteArticleByID } = articleService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);

  useEffect(() => {
    updatePageTitle(t("page.title.article.view"));
  }, []);

  return (
    <MultiPaneScreen>
      <WidePane>

        <CardWithTitle title={article.body.title}>
          <DataRow>
            <WideDataCell title={t("forms:article.edit.category")}>
              <OperationButton label={article.body.category.title} icon={faFolder}
                               link={`/categories/view/${article.body.category.id}`}
                               additionalClass="mt-2 w-6/12 inline-block" />
            </WideDataCell>
            <NarrowDataCell title={t("forms:article.edit.general-status")}>
              <ItemEnabledStatusFlag item={article.body} />
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
            <WideDataCell title={t("forms:common.edit.language")}
                          children={t(`forms:common.edit.language.${article.body.locale}`)} />
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
                               link={`/files/view/${file.reference.split("/")[1]}`} />
            )}
          </div>
        </CardWithTitle>

      </WidePane>
      <NarrowPane>
        <PageOperationCard title={t("page-operations.article")}>
          <PageOperationButton
            label={t("page-operations.article.handle-comments") + getHandleCommentButtonSuffix(article.body)}
            icon={faCommenting}
            awareness={article.body.pendingCommentCount ? AwarenessLevel.WARNING : AwarenessLevel.NORMAL}
            link={`/comments/${article.body.id}`} />
          <PageOperationButton label={t("page-operations.article.edit")} icon={faPencil}
                               link={`/articles/edit/${article.body.id}`} />
          <PageOperationButton label={t("page-operations.article.back-to-articles")} icon={faList} link={"/articles"} />
          <GeneralStatusUpdateOperation domain={"article"} entity={article.body}
                                        titleSupplier={article => article.title}
                                        serviceCall={changeGeneralStatus} mutate={mutate} />
          <ArticlePublicationStatusUpdate article={article} environment={environment} mutate={mutate} />
          <DeleteOperation domain={"article"} entity={article.body} titleSupplier={article => article.title}
                           serviceCall={deleteArticleByID} />
        </PageOperationCard>
      </NarrowPane>
    </MultiPaneScreen>
  )
}
