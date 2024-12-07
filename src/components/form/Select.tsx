import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import React, { ChangeEvent, ReactNode, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface SelectProps {
  registerReturn: UseFormRegisterReturn<any>;
  label: string;
  optionMap: Record<number | string, string>;
  multiple?: boolean;
  search?: boolean;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

interface SelectWithHintProps extends Omit<SelectProps, "optionMap"> {
  optionMap: Record<number | string, { value: string, hint: string }>;
}

/**
 * Renders a form select dropdown styled by TW-Elements.
 *
 * @param registerReturn React Hook Form registration result
 * @param label label of the select dropdown
 * @param optionMap select options to be rendered as a flat key-value object
 * @param multiple enables multiselect behaviors
 * @param search enables rendering a search input
 * @param onChange additional operation to execute upon changing option
 */
export const Select = ({ registerReturn, label, optionMap, multiple = false, search = false, onChange = undefined}: SelectProps): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Input, TWElement.Select]));
  }, []);

  return (
    <div className="mb-3 max-w-[90%]">
      <select data-te-select-init="" {...registerReturn} multiple={multiple} data-te-select-filter={search} onChange={onChange}>
        {Object.entries(optionMap)
          .map(option => <option key={option[0]} value={option[0]}>{option[1]}</option>)}
      </select>
      <label data-te-select-label-ref="">{label}</label>
    </div>
  )
}

/**
 * Renders a form select dropdown with "hints" (item descriptions) styled by TW-Elements.
 *
 * @param registerReturn React Hook Form registration result
 * @param label label of the select dropdown
 * @param optionMap select options to be rendered as a complex record, with string or number key, and the value being the option value along with the related hint
 * @param multiple enables multiselect behaviors
 * @param search enables rendering a search input
 */
export const SelectWithHint = ({ registerReturn, label, optionMap, multiple = false, search = false }: SelectWithHintProps): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Input, TWElement.Select]));
  }, []);

  return (
    <div className="mb-3 max-w-[90%]">
      <select data-te-select-init="" {...registerReturn} multiple={multiple} data-te-select-filter={search}
              data-te-select-option-height="52">
        {Object.entries(optionMap)
          .map(option =>
            <option key={option[0]} value={option[0]} data-te-select-secondary-text={option[1].hint}>{option[1].value}</option>
          )}
      </select>
      <label data-te-select-label-ref="">{label}</label>
    </div>
  )
}
