import React from 'react';
import { toast } from 'react-hot-toast';
import supabase from '../supabase';
import Button from './Button';

/**
 * The button the user can use to sign out.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function SignOutButton() {
  const onClick = async () => {
    // Signing out takes no time at all, so fake a delay
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const result = await supabase.auth.signOut();

    if (result.error != null) {
      toast.error('Could not sign out via GitHub. See console for details.');
      console.error(result.error);
      return { isActive: false };
    }

    return { isActive: true };
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
