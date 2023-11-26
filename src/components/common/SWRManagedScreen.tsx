import { ErrorScreen } from "@/components/common/ErrorScreen";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { ReactNode } from "react";

/**
 * TODO.
 * @param child
 * @param isLoading
 * @param error
 */
export const SWRManagedScreen = ({ children, isLoading, error }: { children: () => ReactNode, isLoading: boolean, error: { response: { status: number } } }): ReactNode => {

  if (isLoading) {
    return <InlineLoadingIndicator />;
  }

  if (error) {
    return <ErrorScreen {...error} />
  }

  return children();
}
