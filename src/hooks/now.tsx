import React, { createContext, useContext } from 'react';

type ContextValue = Date;

type Props = {
  children?: React.ReactNode;
};

const NowContext = createContext<ContextValue>(new Date());

/**
 * Provider that exposes `now`, which is the time that the app was rendered.
 *
 * @param props - The props for this component.
 * @param props.children - The children of this component.
 * @returns The JSX that renders this component.
 */
export function NowProvider({ children }: Props): JSX.Element {
  return (
    <NowContext.Provider value={new Date()}>{children}</NowContext.Provider>
  );
}

/**
 * Hook for retrieving the current time.
 *
 * @returns The current time.
 */
export function useNow(): ContextValue {
  return useContext(NowContext);
}
