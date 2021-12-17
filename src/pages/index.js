import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import DashboardPage from '../components/DashboardPage';
import SignInPage from '../components/SignInPage';

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
    <>
      <Head>
        <title>Pull Request Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
