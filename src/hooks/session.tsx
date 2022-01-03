import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '../types';

type ContextValue = {
  session: Session | null;
  setSession: (session: Session) => void;
};

type Props = {
  children?: React.ReactNode;
};

export const SIGNED_OUT_SESSION = { type: 'signedOut' } as const;

const SessionContext = createContext<ContextValue>({
  session: SIGNED_OUT_SESSION,
  setSession: (_session: Session) => {
    // no-op
  },
});

/**
 * Provider that exposes `session`, which holds information about the signed-in
 * GitHub user.
 *
 * @param props - The props for this component.
 * @param props.children - The children of this component.
 * @returns The JSX that renders this component.
 */
export function SessionProvider({ children }: Props): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('session');

    // TODO: Only save the API token
    if (savedSession == null) {
      setSession(SIGNED_OUT_SESSION);
    } else {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  useEffect(() => {
    if (session != null) {
      if (session.type === 'signedIn') {
        localStorage.setItem('session', JSON.stringify(session));
      } else {
        localStorage.removeItem('session');
      }
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Hook for retrieving the current session.
 *
 * @returns The current session.
 */
export function useSession(): ContextValue {
  return useContext(SessionContext);
}
