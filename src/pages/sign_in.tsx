import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '../constants';
import { fetchViewer } from '../github';
import Button from '../components/Button';
import { useSession } from '../hooks/session';

/**
 * The page the user can use to sign in.
 *
 * @returns The JSX used to render this component.
 */
export default function SignInPage(): JSX.Element | null {
  const router = useRouter();
  const { session, setSession } = useSession();
  const [apiToken, setApiToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApiToken = event.currentTarget.value;
    setApiToken(newApiToken);
  };

  const onButtonClick = async () => {
    setError(null);
    try {
      const { viewer } = await fetchViewer({ apiToken });
      const newSession = {
        type: 'signedIn' as const,
        apiToken,
        user: {
          login: viewer.login,
          orgLogins: viewer.organizations.nodes.map(
            (organizationNode) => organizationNode.login,
          ),
        },
      };
      if (newSession.user.orgLogins.includes('MetaMask')) {
        // TODO: This causes a "Can't perform a React state update on an
        // unmounted component" error if something breaks after sign-in
        setSession(newSession);
      } else {
        setError('This tool is only supported by MetaMaskians at the moment!');
      }
    } catch (authenticationError) {
      setError(
        "Hmm, we had problems using that token. Please double check that it's valid.",
      );
      console.error(authenticationError);
    }
  };

  useEffect(() => {
    if (session?.type === 'signedIn') {
      router.replace(ROUTES.PULL_REQUESTS);
    }
  }, [session, router]);

  return session?.type === 'signedOut' ? (
    <>
      <div className="mb-4">
        <label className="block mb-1">
          Enter your{' '}
          <a
            className="text-blue-500 hover:underline"
            href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
            target="_blank"
            rel="noreferrer"
          >
            GitHub personal access token
          </a>
          :
        </label>
        <input
          className="block mb-1 rounded-lg py-1.5 px-3.5 border border-neutral-200 w-[40em]"
          type="text"
          onChange={onInputChange}
        />
        {error != null ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : null}
      </div>
      <div>
        <Button
          inactiveLabel="Sign in"
          activeLabel="Signing in..."
          onClick={onButtonClick}
          disabled={apiToken.length === 0}
        />
      </div>
    </>
  ) : null;
}
