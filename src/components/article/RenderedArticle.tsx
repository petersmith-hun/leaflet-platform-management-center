import { Modal } from "@/components/common/Modal";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { faPrint, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LocalPageOperationButtonProperties {
  label: string;
  icon: IconDefinition;
  onClick: () => void;
  awareness?: AwarenessLevel;
}

const RenderArticleButton = ({ label, icon, onClick, awareness = AwarenessLevel.NORMAL }: LocalPageOperationButtonProperties): ReactNode => {

  return (
    <div className="mr-2 mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#article-render-modal"
              className={`${awareness} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={onClick}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
      </button>
    </div>
  )
}

/**
 * TODO.
 *
 * @param content
 * @param resourceServer
 */
export const RenderedArticle = ({ content, resourceServer }: { content: string, resourceServer: string }): ReactNode => {

  const processedContent = content.replaceAll("{resource-server-url}", resourceServer);

  return (
    <div className="prose dark:prose-invert max-w-full">
      <Markdown remarkPlugins={[remarkGfm]}>
        {processedContent}
      </Markdown>
    </div>
  );
}

/**
 * TODO.
 */
export const RenderedArticleModal = ({ content, resourceServer, onRender }: { content: string, resourceServer: string, onRender: () => void }): ReactNode => {

  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      const { Modal, initTE } = await import("tw-elements");
      initTE({ Modal }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <>
      <RenderArticleButton awareness={AwarenessLevel.POSITIVE} label={t("page-operations.article.render")} icon={faPrint} onClick={onRender} />
      <Modal id={"article-render-modal"} title={t("modal.title.rendered-article")}>
        <RenderedArticle content={content} resourceServer={resourceServer} />
      </Modal>
    </>
  )
}
