import React from 'react';
import { signOut } from 'next-auth/react';
import Button from './Button';

/**
 * The button the user can use to sign out.
 *
 * @returns The JSX used to render this component.
 */
export default function SignOutButton(): JSX.Element {
  const onClick = async () => {
    // Signing out takes no time at all, so fake a delay
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    signOut();
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
