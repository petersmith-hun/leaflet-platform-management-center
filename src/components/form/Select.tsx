import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

/**
 * TODO.
 */
export const Select = ({ registerReturn, label, optionMap }: { registerReturn: UseFormRegisterReturn<any>, label: string, optionMap: Record<string, string>}): ReactNode => {

  return (
    <div className="mb-3">
      <select data-te-select-init="" {...registerReturn}>
        {Object.entries(optionMap)
          .map(option => <option key={option[0]} value={option[0]}>{option[1]}</option>)}
      </select>
      <label data-te-select-label-ref="">{label}</label>
    </div>
  )
}
