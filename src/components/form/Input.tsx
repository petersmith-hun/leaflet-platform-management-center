import { ValidatedInput, Validation } from "@/components/form/Validation";
import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { ReactNode, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends ValidatedInput {

  registerReturn: UseFormRegisterReturn<any>;
  label: string;
  id: string;
  readonly?: boolean;
  password?: boolean;
}

/**
 * Renders a form input styled by TW-Elements.
 *
 * @param registerReturn React Hook Form registration result
 * @param label label of the input
 * @param id ID of the input
 * @param readonly makes the input read-only
 * @param errorSupplier validation error supplier
 * @param password indicates the input to be rendered as password input (defaults to false)
 */
export const Input = ({ registerReturn, label, id, readonly = false, errorSupplier, password = false }: InputProps): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Input]));
  }, []);

  return (
    <div className="mb-3 max-w-[90%]">
      <div className="relative" data-te-input-wrapper-init="">
        <input type={password ? "password" : "text"}
               className="read-only:dark:bg-neutral-600 peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
               id={id}
               placeholder={label}
               readOnly={readonly}
               {...registerReturn} />
        <label htmlFor={id}
               className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
          {label}
        </label>
      </div>
      <Validation message={errorSupplier?.()} />
    </div>
  )
}
