import { ErrorScreen } from "@/components/common/ErrorScreen";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { WidePane } from "@/components/common/ScreenLayout";
import { ReactNode } from "react";

interface SWRManagedScreenProps {
  children: () => ReactNode;
  isLoading: boolean;
  error: {
    response: {
      status: number
    }
  };
}

/**
 * Skeleton for screens hydrated by SWR. Adds a loading indicator, while SWR fetches data, as well the default error handling.
 * Child node is not rendered until the data finished loading, also if an error occurs.
 *
 * @param child child node supplier function to render after a successful SWR call
 * @param isLoading indicates if SWR is still processing the request
 * @param error provides error information
 */
export const SWRManagedScreen = ({ children, isLoading, error }: SWRManagedScreenProps): ReactNode => {

  if (isLoading) {
    return (
      <WidePane>
        <InlineLoadingIndicator />
      </WidePane>
    );
  }

  if (error) {
    return (
      <WidePane>
        <ErrorScreen {...error} />
      </WidePane>
    );
  }

  return children();
}
