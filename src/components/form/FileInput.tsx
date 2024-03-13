import { ValidatedInput, Validation } from "@/components/form/Validation";
import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { ReactNode, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FileInputProps extends ValidatedInput {

  registerReturn: UseFormRegisterReturn<any>;
}

/**
 * Renders a form file input styled by TW-Elements.
 *
 * @param registerReturn React Hook Form registration result
 * @param errorSupplier validation error supplier
 */
export const FileInput = ({ registerReturn, errorSupplier }: FileInputProps): ReactNode => {

  const { t } = useTranslation();

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Input]));
  }, []);

  return (
    <div className="mb-3 max-w-[90%]">
      <div className="relative">
        <label htmlFor="formFile"
               className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">{t("forms:file.edit.file-input")}</label>
        <input {...registerReturn}
          className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
          type="file" id="file-upload-input" />
      </div>
      <Validation message={errorSupplier?.()} />
    </div>
  )
}
