import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * TODO.
 *
 * @param registerReturn
 * @param label
 * @param optionMap
 * @param multiple
 * @param search
 */
export const Select = ({ registerReturn, label, optionMap, multiple = false, search = false }: {
  registerReturn: UseFormRegisterReturn<any>,
  label: string,
  optionMap: Record<number | string, string>,
  multiple?: boolean,
  search?: boolean
}): ReactNode => {

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
