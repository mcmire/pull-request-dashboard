import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './DashboardPage';
import SignInPage from './SignInPage';

/**
 * Component for the entire app.
 *
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('session');

    if (savedSession != null) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  useEffect(() => {
    if (session != null) {
      localStorage.setItem('session', JSON.stringify(session));
    }
  }, [session]);

  return (
    <>
      {session != null ? (
        <DashboardPage session={session} setSession={setSession} />
      ) : (
        <SignInPage setSession={setSession} />
      )}
      <Toaster
        position="bottom-right"
        toastOptions={{
          error: {
            duration: 10000,
          },
        }}
      />
    </>
  );
}
