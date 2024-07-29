import { initCompletion } from "@/components/system/logs/tlql/completion";
import { TLQL } from "@/components/system/logs/tlql/index";
import { initLanguage } from "@/components/system/logs/tlql/language";
import { initTheme } from "@/components/system/logs/tlql/theme";
import { Monaco } from "@monaco-editor/react";

let tlqlMonacoEditorInitialized = false;

/**
 * Initializes the TLQL Monaco Editor.
 *
 * @param monaco Monaco Editor instance
 */
export const tlqlMonacoEditorInit = (monaco?: Monaco): void => {

  if (monaco && !tlqlMonacoEditorInitialized) {
    doInit(monaco);
    tlqlMonacoEditorInitialized = true;
  }
}

const doInit = (monaco?: Monaco): void => {

  monaco?.languages.register({ id: TLQL.languageID });
  initLanguage(monaco);
  initTheme(monaco);
  initCompletion(monaco);
}
