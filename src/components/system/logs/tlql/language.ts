import { TLQL, TokenType, vocabulary } from "@/components/system/logs/tlql";
import { Monaco } from "@monaco-editor/react";

/**
 * Initializes the TLQL language tokens.
 *
 * @param monaco Monaco Editor instance
 */
export const initLanguage = (monaco?: Monaco): void => {

  monaco?.languages.setMonarchTokensProvider(TLQL.languageID, {
    keywords: vocabulary,
    tokenizer: {
      root: [
        [/@?[a-zA-Z][\w$]*/, {
          cases: {
            "@keywords": TokenType.KEYWORD,
            "@default": TokenType.VARIABLE
          }
        }],
        [/".*?"/, TokenType.STRING],
        [/'.*?'/, TokenType.STRING],
        [/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{1,2}:[0-9]{2}:[0-9]{2}?/, TokenType.DATETIME],
        [/[0-9]{4}-[0-9]{2}-[0-9]{2}?/, TokenType.DATETIME],
        [/[0-9]+?/, TokenType.NUMBER]
      ]
    }
  });
}
