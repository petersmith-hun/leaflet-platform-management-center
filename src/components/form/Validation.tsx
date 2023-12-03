import { ReactNode } from "react";

export interface ValidatedInput {

  /**
   * TODO.
   */
  errorSupplier?: () => string | undefined;
}

/**
 * TODO.
 * @param message
 */
export const Validation = ({ message }: { message: string | undefined }): ReactNode => {

  if (!message) {
    return null;
  }

  return (
    <p className="text-danger text-sm text-right mt-1">{message}</p>
  )
}
