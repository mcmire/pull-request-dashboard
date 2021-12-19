import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const TimeContext = createContext();

/**
 * Provider that exposes `now`, which is the time that the app was rendered.
 *
 * @param {object} props - The props for this component.
 * @param {*} props.children - The children of this component.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export function TimeProvider({ children }) {
  return (
    <TimeContext.Provider value={{ now: new Date() }}>
      {children}
    </TimeContext.Provider>
  );
}

TimeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
