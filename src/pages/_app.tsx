import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { NowProvider } from '../hooks/now';
import { SessionProvider } from '../hooks/session';

import '../styles/globals.css';

type Props = {
  Component: React.JSXElementConstructor<Record<string, unknown>>;
  pageProps: Record<string, unknown>;
};

/**
 * The root Next.js component.
 *
 * @param props - The props to this component.
 * @param props.Component - The page component.
 * @param props.pageProps - The props to render the component with.
 * @returns The JSX used to render this component.
 */
export default function App({ Component, pageProps }: Props): JSX.Element {
  return (
    <SessionProvider>
      <NowProvider>
        <Head>
          <title>Pull Request Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            error: {
              duration: 10000,
            },
          }}
        />
      </NowProvider>
    </SessionProvider>
  );
}
