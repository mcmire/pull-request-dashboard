import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  useSession as useNextAuthSession,
  SessionProvider as NextAuthSessionProvider,
} from 'next-auth/react';
import { fetchViewer } from '../github';
import { Session } from '../types';

type ContextValue = {
  session: Session | null;
  setSession: (session: Session) => void;
};

type Props = {
  children?: React.ReactNode;
};

const STORAGE_KEY = 'session/v2';
export const SIGNED_OUT_SESSION = { type: 'signedOut' as const };

const SessionContext = createContext<ContextValue>({
  session: SIGNED_OUT_SESSION,
  setSession: (_session: Session) => {
    // no-op
  },
});

/**
 * Component that loads and persists session information from localStorage and
 * exposes it to the enclosed children.
 *
 * @param props - The props for this component.
 * @param props.children - The children of this component.
 * @returns The JSX that renders this component.
 */
function SessionStore({ children }: Props): JSX.Element {
  const nextAuth = useNextAuthSession();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);

    if (savedSession != null) {
      setSession(JSON.parse(savedSession));
    } else {
      setSession(SIGNED_OUT_SESSION);
    }
  }, []);

  useEffect(() => {
    let authenticationSucceeded = null;

    if (nextAuth.status === 'authenticated') {
      const accessToken = nextAuth.data.accessToken as string;

      fetchViewer({ accessToken })
        .then((response) => {
          const newSession = {
            type: 'signedIn' as const,
            accessToken,
            user: {
              login: response.viewer.login,
              orgLogins: response.viewer.organizations.nodes.map(
                (organizationNode) => organizationNode.login,
              ),
            },
          };
          setSession(newSession);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
          authenticationSucceeded = true;
        })
        .catch((error) => {
          if (/Bad credentials/u.test(error.message)) {
            authenticationSucceeded = false;
          } else {
            throw error;
          }
        });
    }

    if (
      nextAuth.status === 'unauthenticated' ||
      authenticationSucceeded === false
    ) {
      setSession(SIGNED_OUT_SESSION);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [nextAuth]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Component that makes use of next-auth to provide authentication information
 * to the enclosed children.
 *
 * @param props - The props for this component.
 * @param props.children - The children of this component.
 * @returns The JSX that renders this component.
 */
export function SessionProvider({ children }: Props): JSX.Element {
  return (
    <NextAuthSessionProvider>
      <SessionStore>{children}</SessionStore>
    </NextAuthSessionProvider>
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
