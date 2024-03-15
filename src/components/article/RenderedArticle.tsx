import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LocalPageOperationButtonProperties {
  onClick: () => void;
}

interface RenderedArticleProps {
  content: string;
  resourceServer: string;
}

/**
 * Renders a render trigger button, including an onClick listener, which can be used to execute additional operations
 * before actually rendering the content (e.g. populating the content).
 *
 * @param onClick callback function to execute additional operations before rendering
 */
export const RenderArticleButton = ({ onClick }: LocalPageOperationButtonProperties): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#article-render-modal"
              className={`${AwarenessLevel.WARNING} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={onClick}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={faPrint} /> {t("page-operations.article.render")}
      </button>
    </div>
  )
}

/**
 * Markdown renderer component used to render the article's MD source as HTML. Renders the article as a static,
 * embedded HTML segment.
 *
 * @param content raw MD source of the article
 * @param resourceServer resource server address for rendering the embedded images
 */
export const RenderedArticle = ({ content, resourceServer }: RenderedArticleProps): ReactNode => {

  const processedContent = content.replaceAll("{resource-server-url}", resourceServer);

  return (
    <div className="prose dark:prose-invert max-w-full">
      <Markdown remarkPlugins={[remarkGfm]}>
        {processedContent}
      </Markdown>
    </div>
  )
}
