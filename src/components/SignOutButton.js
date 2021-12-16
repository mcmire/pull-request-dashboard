import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * The button the user can use to sign out.
 *
 * @param {object} props - The props to this component.
 * @param {Function} props.setSession - A function used to update the current
 * auth session.
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function SignOutButton({ setSession }) {
  const onClick = async () => {
    // Signing out takes no time at all, so fake a delay
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    setSession(null);
  };

  return (
    <Button
      className="text-sm"
      inactiveLabel="Sign out"
      activeLabel="Signing out..."
      onClick={onClick}
    />
  );
}

SignOutButton.propTypes = {
  setSession: PropTypes.func.isRequired,
};
