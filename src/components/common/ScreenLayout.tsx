import { tailwindElementsLoader, TWElement } from "@/components/utility/tailwind-helper";
import { ReactNode, useEffect } from "react";

interface PaneProps {
  children: ReactNode;
}

/**
 * Renders the skeleton for a multi-pane screen. Items within are aligned used flex-row directive.
 *
 * @param children contents to be rendered within
 */
export const MultiPaneScreen = ({ children }: PaneProps): ReactNode => {

  useEffect(() => {
    tailwindElementsLoader()
      .then(loader => loader.load([TWElement.Sticky]));
  }, []);

  return (
    <div className="flex lg:flex-row flex-col-reverse justify-between">
      {children}
    </div>
  )
}

/**
 * Renders a wide (w-9/12) pane within a multi-pane screen.
 *
 * @param children contents to be rendered within
 */
export const WidePane = ({ children }: PaneProps): ReactNode => {

  return (
    <div className="w-full lg:w-9/12 max-w-7xl mr-3">
      {children}
    </div>
  )
}

/**
 * Renders a narrow (w-3/12) pane within a multi-pane screen.
 *
 * @param children contents to be rendered within
 */
export const NarrowPane = ({ children }: PaneProps): ReactNode => {

  return (
    <div className="w-full lg:w-3/12" data-te-sticky-init="" data-te-sticky-direction="both">
      {children}
    </div>
  )
}
