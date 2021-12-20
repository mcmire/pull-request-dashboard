import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const NowContext = createContext();

/**
 * Provider that exposes `now`, which is the time that the app was rendered.
 *
 * @param {object} props - The props for this component.
 * @param {*} props.children - The children of this component.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export function NowProvider({ children }) {
  return (
    <NowContext.Provider value={new Date()}>{children}</NowContext.Provider>
  );
}

NowProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook for retrieving the current time.
 *
 * @returns {Date} The current time.
 */
export function useNow() {
  return useContext(NowContext);
}
