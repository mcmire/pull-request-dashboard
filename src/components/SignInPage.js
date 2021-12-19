import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fetchViewer } from '../github';
import Button from './Button';

/**
 * The page the user can use to sign in.
 *
 * @param {object} props - The props to this component.
 * @param {Function} props.setSession - A function used to update the current
 * auth session.
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function SignInPage({ setSession }) {
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState(null);

  const onInputChange = (event) => {
    const newApiToken = event.currentTarget.value;
    setApiToken(newApiToken);
  };

  const onButtonClick = async () => {
    setError(null);
    try {
      const { viewer } = await fetchViewer({ apiToken });
      const session = {
        apiToken,
        user: {
          login: viewer.login,
          orgLogins: viewer.organizations.nodes.map(
            (organizationNode) => organizationNode.login,
          ),
        },
      };
      if (session.user.orgLogins.includes('MetaMask')) {
        // TODO: This causes a "Can't perform a React state update on an
        // unmounted component" error if something breaks after sign-in
        setSession(session);
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

  return (
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
          className="block mb-1 rounded-lg py-1.5 px-3.5 border border-gray-200 w-[40em]"
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
  );
}

SignInPage.propTypes = {
  setSession: PropTypes.func.isRequired,
};
