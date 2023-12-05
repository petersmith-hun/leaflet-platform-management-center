import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface SelectProps {
  registerReturn: UseFormRegisterReturn<any>;
  label: string;
  optionMap: Record<number | string, string>;
  multiple?: boolean;
  search?: boolean;
}

/**
 * Renders a form select dropdown styled by TW-Elements.
 *
 * @param registerReturn React Hook Form registration result
 * @param label label of the select dropdown
 * @param optionMap select options to be rendered as a flat key-value object
 * @param multiple enables multiselect behaviors
 * @param search enables rendering a search input
 */
export const Select = ({ registerReturn, label, optionMap, multiple = false, search = false }: SelectProps): ReactNode => {

  return (
    <div className="mb-3 max-w-[90%]">
      <select data-te-select-init="" {...registerReturn} multiple={multiple} data-te-select-filter={search}>
        {Object.entries(optionMap)
          .map(option => <option key={option[0]} value={option[0]}>{option[1]}</option>)}
      </select>
      <label data-te-select-label-ref="">{label}</label>
    </div>
  )
}
