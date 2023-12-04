import { ReactNode, useEffect } from "react";

/**
 * TODO.
 * @param children
 */
export const MultiPaneScreen = ({ children }: { children: ReactNode }): ReactNode => {

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
 * TODO.
 * @param children
 */
export const WidePane = ({ children }: { children: ReactNode }): ReactNode => {

  return (
    <div className="w-9/12 max-w-7xl mr-3">
      {children}
    </div>
  )
}

/**
 * TODO.
 * @param children
 */
export const NarrowPane = ({ children }: { children: ReactNode }): ReactNode => {

  return (
    <div className="w-3/12" data-te-sticky-init="" data-te-sticky-direction="both">
      {children}
    </div>
  )
}
