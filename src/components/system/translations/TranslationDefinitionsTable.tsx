import { TranslationPack } from "@/core/model/translations";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Renders a table showing all definition of the given translation pack. The rendered table is searchable, and can be
 * sorted by the translation key.
 *
 * @param pack data of an existing translation pack
 */
export const TranslationDefinitionsTable = ({ pack }: { pack: TranslationPack }): ReactNode => {

  const { t } = useTranslation();

  let initialized = false;

  useEffect(() => {
    const init = async () => {

      if (initialized) {
        return;
      }

      initialized = true;

      const data = {
        columns: [
          { label: t("system.translations.definitions.label.key"), field: "key", sort: true },
          { label: t("system.translations.definitions.label.value"), field: "value" }
        ],
        rows: pack.definitions.sort((left, right) => left.key.localeCompare(right.key))
      }

      const { Datatable } = await import("tw-elements");
      const instance = new Datatable(document.getElementById("definitions-datatable"), data);
      document.getElementById("definitions-search-input")?.addEventListener("input", (event) => {
        instance.search((event.target as HTMLInputElement)?.value);
      });
    };
    init();
  }, []);

  return (
    <>
      <div className="mb-3">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            id="definitions-search-input"
            type="search"
            className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder={t("system.translations.definitions.label.search")}
            aria-label={t("system.translations.definitions.label.search")}
            aria-describedby="button-addon1" />
        </div>
      </div>
      <div id="definitions-datatable"></div>
    </>
  )
}
