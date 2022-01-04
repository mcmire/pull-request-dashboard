import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ROUTES } from '../constants';
import Button from '../components/Button';
import { useSession } from '../hooks/session';

/**
 * The page the user can use to sign in.
 *
 * @returns The JSX used to render this component.
 */
export default function SignInPage(): JSX.Element | null {
  const router = useRouter();
  const { session } = useSession();

  const onClick = () => {
    signIn('github');
  };

  useEffect(() => {
    if (session?.type === 'signedIn') {
      router.replace(ROUTES.PULL_REQUESTS);
    }
  }, [session, router]);

  return session?.type === 'signedOut' ? (
    <Button
      inactiveLabel="Sign in with GitHub"
      activeLabel="Signing in..."
      onClick={onClick}
    />
  ) : null;
}
