import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SessionContext = createContext();

/**
 * Provider that exposes `session`, which is the time that the app was rendered.
 *
 * @param {object} props - The props for this component.
 * @param {*} props.children - The children of this component.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export function SessionProvider({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const savedSession = localStorage.getItem('session');

    if (savedSession === undefined) {
      setSession(null);
    } else {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  useEffect(() => {
    if (session !== undefined) {
      if (session === null) {
        localStorage.removeItem('session');
      } else {
        localStorage.setItem('session', JSON.stringify(session));
      }
    }
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook for retrieving the current time.
 *
 * @returns {Date} The current time.
 */
export function useSession() {
  return useContext(SessionContext);
}
