import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { NowProvider } from '../hooks/now';
import { SessionProvider } from '../hooks/session';

import '../styles/globals.css';

/**
 * The default Next.js page component.
 *
 * @param {object} props - The props to this component.
 * @param {*} props.Component - The page component.
 * @param {object} props.pageProps - The props to render the component with.
 * @returns {JSX.Element} The JSX used to render this component.
 */
function App({ Component, pageProps }) {
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

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
