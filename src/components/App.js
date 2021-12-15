import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import supabase from '../supabase';
import DashboardPage from './DashboardPage';
import SignInViaGitHubPage from './SignInViaGitHubPage';

/**
 * Component for the entire app.
 *
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const initialSession = supabase.auth.currentSession;

    if (initialSession != null) {
      setSession(initialSession);
    }

    const {
      data: { unsubscribe },
    } = supabase.auth.onAuthStateChange((event, receivedSession) => {
      if (event === 'SIGNED_IN') {
        // TODO: This may not be necessary since the page will reload anyway on
        // sign-in
        setSession(receivedSession);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else {
        console.log('Unhandled supabase.auth.onAuthStateChange', event);
      }
    });

    // TODO: Keep from flashing Sign In button when page is refreshed
    setIsLoaded(true);

    return () => {
      unsubscribe();
    };
  }, []);

  return isLoaded ? (
    <>
      {session != null ? (
        <DashboardPage session={session} />
      ) : (
        <SignInViaGitHubPage setSession={setSession} />
      )}
      <Toaster />
    </>
  ) : null;
}
