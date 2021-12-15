import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import supabase from '../supabase';
import Button from './Button';

/**
 * The page the user can use to sign in via GitHub.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function SignInViaGitHubPage() {
  const onClick = async () => {
    const result = await supabase.auth.signIn({
      provider: 'github',
    });
    navigator.clipboard.writeText(JSON.stringify(result));

    if (result.error != null) {
      toast.error('Could not sign in via GitHub. See console for details.');
      console.error(result.error);
      return { isActive: false };
    }

    return { isActive: true };
  };

  return (
    <div>
      <Button
        inactiveLabel="Sign in via GitHub"
        activeLabel="Signing in..."
        onClick={onClick}
      />
    </div>
  );
}
