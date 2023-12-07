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
    const init = async () => {
      const { Sticky, initTE } = await import("tw-elements");
      initTE({ Sticky }, { allowReinits: true });
    };
    init();
  }, []);


  return (
    <div className="flex flex-row justify-between">
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
    <div className="w-9/12 max-w-7xl mr-3">
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
    <div className="w-3/12" data-te-sticky-init="" data-te-sticky-direction="both">
      {children}
    </div>
  )
}
