import { ReactNode } from "react";

interface ValidationProps {
  message: string | undefined;
}

/**
 * Interface for validated inputs to integrate with the Validation component.
 */
export interface ValidatedInput {

  /**
   * Supplier arrow function to provide the validation error message.
   */
  errorSupplier?: () => string | undefined;
}

/**
 * Renders a validation error message (if any) below the attached form input.
 *
 * @param message error message to be rendered
 */
export const Validation = ({ message }: ValidationProps): ReactNode => {

  if (!message) {
    return null;
  }

  return (
    <p className="text-danger text-sm text-right mt-1">{message}</p>
  )
}
