import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import PullRequestsPage from '../components/PullRequestsPage';
import SignInPage from '../components/SignInPage';
import { TimeProvider } from '../contexts/time';

/**
 * Component for the entire app.
 *
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function Home() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const savedSession = localStorage.getItem('session');

    if (savedSession != null) {
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
    <TimeProvider>
      <Head>
        <title>Pull Request Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session != null ? (
        <PullRequestsPage session={session} setSession={setSession} />
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
    </TimeProvider>
  );
}
