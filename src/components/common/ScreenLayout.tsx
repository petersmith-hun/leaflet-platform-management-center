import { ReactNode } from "react";

/**
 * TODO.
 * @param children
 */
export const MultiPaneScreen = ({ children }: { children: ReactNode }): ReactNode => {

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
    <div className="w-3/12">
      {children}
    </div>
  )
}
