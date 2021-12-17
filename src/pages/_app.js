import React from 'react';
import PropTypes from 'prop-types';

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
  return <Component {...pageProps} />;
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
