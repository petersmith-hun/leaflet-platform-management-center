import { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
