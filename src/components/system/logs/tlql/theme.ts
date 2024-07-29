import { TLQL, TokenType } from "@/components/system/logs/tlql/index";
import { Monaco } from "@monaco-editor/react";

const baseTheme = "vs-dark";
const colors = {
  keyword: "#3e7bed",
  variable: "#a420f7",
  string: "#1e7d37",
  number: "#ff6600",
  datetime: "#ff6600"
}

enum FontStyle {
  BOLD = "bold",
  ITALIC = "italic"
}

/**
 * Initializes the TLQL Monaco theme, which is a modified version of the default VS-Dark theme.
 *
 * @param monaco Monaco Editor instance
 */
export const initTheme = (monaco?: Monaco): void => {

  monaco?.editor.defineTheme(TLQL.theme, {
    colors: {},
    inherit: true,
    base: baseTheme,
    rules: [
      { token: TokenType.KEYWORD, foreground: colors.keyword, fontStyle: FontStyle.BOLD },
      { token: TokenType.VARIABLE, foreground: colors.variable, fontStyle: FontStyle.ITALIC },
      { token: TokenType.STRING, foreground: colors.string },
      { token: TokenType.NUMBER, foreground: colors.number },
      { token: TokenType.DATETIME, foreground: colors.datetime }
    ]
  });
}
