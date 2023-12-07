import removeAccents from "remove-accents";

const spacePattern = / /g;
const specialCharPattern = /[\[\]()+*!?\\/:;.,]/g

const titleUpdateListener = (): void => {

  const linkInput = document.getElementById("article-link") as HTMLInputElement;
  const titleInput = document.getElementById("article-title") as HTMLInputElement;

  linkInput.value = removeAccents(titleInput.value)
    .toLowerCase()
    .trim()
    .replace(specialCharPattern, '')
    .replace(spacePattern, '-');
  linkInput.focus();
  titleInput.focus();
};

/**
 * Generates a sanitized link based on the input value and writes it into the target input field.
 * Sanitization actually materializes in the following steps:
 *  - Removing accents;
 *  - Making the input string lowercase;
 *  - Trimming the leading and trailing whitespaces;
 *  - Replacing the special characters with empty characters;
 *  - Replacing the spaces with dashes.
 *
 * @param generateLink enables/disabled generating the link
 */
export const generateLinkByTitle = (generateLink: boolean): void => {

  const titleInput = document.getElementById("article-title") as HTMLInputElement;

  if (generateLink) {
    titleInput.addEventListener("keyup", titleUpdateListener);
  } else {
    titleInput.removeEventListener("keyup", titleUpdateListener);
  }
}
