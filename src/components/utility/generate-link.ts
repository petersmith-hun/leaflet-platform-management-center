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
 * TODO.
 *
 * @param generateLink
 */
export const generateLinkByTitle = (generateLink: boolean): void => {

  const titleInput = document.getElementById("article-title") as HTMLInputElement;

  if (generateLink) {
    titleInput.addEventListener("keyup", titleUpdateListener);
  } else {
    titleInput.removeEventListener("keyup", titleUpdateListener);
  }
}
