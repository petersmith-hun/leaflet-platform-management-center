import { ValidatedInput, Validation } from "@/components/form/Validation";
import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps extends ValidatedInput {
  registerReturn: UseFormRegisterReturn<any>;
  label: string;
  id: string;
  defaultRowCount?: number;
}

/**
 * TODO.
 *
 * @param registerReturn
 * @param label
 * @param id
 * @param errorSupplier
 * @param defaultRowCount
 */
export const Textarea = ({ registerReturn, label, id, errorSupplier, defaultRowCount = 3 }: TextareaProps): ReactNode => {

  return (
    <div className="mb-3 max-w-[95%]">
      <div className="relative mb-3" data-te-input-wrapper-init="">
      <textarea
        className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id={id}
        rows={defaultRowCount}
        placeholder={label}
        {...registerReturn}>
      </textarea>
        <label htmlFor={id}
               className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
          {label}
        </label>
      </div>
      <Validation message={errorSupplier?.()} />
    </div>
  )
}
