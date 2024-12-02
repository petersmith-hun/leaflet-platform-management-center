import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface SwitchProps {
  registerReturn: UseFormRegisterReturn<any>;
  label: string;
  id: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Renders a switch-style checkbox.
 *
 * @param registerReturn React Hook Form registration result
 * @param label label of the input
 * @param id ID of the input
 * @param onClick additional logic to be executed when the switch is clicked
 */
export const Switch = ({ registerReturn, label, id, onClick }: SwitchProps): ReactNode => {

  return (
      <>
        <input
            className="me-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-black/25 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-switch-2 after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ms-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-switch-1 checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-switch-3 focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ms-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-switch-3 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-white/25 dark:after:bg-surface-dark dark:checked:bg-primary dark:checked:after:bg-primary"
            type="checkbox"
            role="switch"
            id={id}
            onClick={onClick}
            {...registerReturn} />
        <label className="inline-block ps-[0.15rem] hover:cursor-pointer" htmlFor={id}>{label}</label>
      </>
  )
}
