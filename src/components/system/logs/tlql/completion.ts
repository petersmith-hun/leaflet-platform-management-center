import { defaultVariables, TLQL, vocabulary } from "@/components/system/logs/tlql/index";
import { Monaco } from "@monaco-editor/react";
import snippets from "@/components/system/logs/tlql/snippets.json";

interface Snippet {
  label: string;
  insert: string;
  documentation: string;
}

interface Range {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

interface Position {
  lineNumber: number;
}

interface Word {
  startColumn: number;
  endColumn: number;
}

interface Model {
  getWordAtPosition(position: Position): Word;
}

enum CompletionType {
  KEYWORD = 17,
  SNIPPET = 27
}

enum InsertTextRule {
  INSERT_AS_SNIPPET = 4
}

/**
 * Initializes TLQL code completion by adding the keywords, default variables and some helper snippets.
 *
 * @param monaco Monaco Editor instance
 */
export const initCompletion = (monaco?: Monaco): void => {

  monaco?.languages.registerCompletionItemProvider(TLQL.languageID, {
    provideCompletionItems(model: any, position: Position) {
      const range = createRange(model, position);
      const suggestions = [
        ...createKeywordSuggestions(range, vocabulary),
        ...createKeywordSuggestions(range, defaultVariables),
        ...(snippets as Snippet[]).map(snippet => createSnippet(range, snippet))
      ];

      return { suggestions: suggestions };
    }
  });
}

const createRange = (model: Model, position: Position): Range => {

  const word = model.getWordAtPosition(position);
  return {
    startLineNumber: position.lineNumber,
    startColumn: word?.startColumn!,
    endLineNumber: position.lineNumber,
    endColumn: word?.endColumn!,
  };
}

const createKeywordSuggestions = (range: Range, wordSet: string[]) => {

  return wordSet.map(word => {

    return {
      label: word,
      kind: CompletionType.SNIPPET.valueOf(),
      insertText: word,
      range: range
    }
  });
}

const createSnippet = (range: Range, snippet: Snippet) => {

  return {
    label: snippet.label,
    kind: CompletionType.KEYWORD.valueOf(),
    insertText: snippet.insert,
    insertTextRules: InsertTextRule.INSERT_AS_SNIPPET.valueOf(),
    documentation: snippet.documentation,
    range: range
  }
}
