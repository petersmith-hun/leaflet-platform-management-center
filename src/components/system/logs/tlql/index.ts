const keywords = [
  "search",
  "with",
  "conditions",
  "order",
  "by",
  "asc",
  "desc",
  "ascending",
  "descending",
  "then",
  "limit",
  "offset"
];

const operators = [
  "either",
  "none",
  "between",
  "and",
  "or"
];

/**
 * Contains the fixed vocabulary of TLQL (keywords and operators).
 */
export const vocabulary = keywords.concat(operators);

/**
 * Contains the list of default variables.
 */
export const defaultVariables = [
  "source",
  "level",
  "message",
  "timestamp",
  "logger",
  "thread"
];

/**
 * Enum constant representing the supported TLQL-Monaco token types.
 */
export enum TokenType {
  KEYWORD = "keyword",
  VARIABLE = "variable",
  STRING = "string",
  NUMBER = "number",
  DATETIME = "date-time",
}

/**
 * TLQL base constants.
 */
export const TLQL = {

  /**
   * Language registration ID of TLQL.
   */
  languageID: "tlql",

  /**
   * TLQL custom theme name.
   */
  theme: "tlql-dark"
};

