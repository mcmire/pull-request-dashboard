import React from 'react';
import { useSession } from '../hooks/session';
import Button from './Button';

/**
 * The button the user can use to sign out.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function SignOutButton() {
  const { setSession } = useSession();
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

SignOutButton.propTypes = {};
