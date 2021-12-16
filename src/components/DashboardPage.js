import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import fetchPullRequests from '../fetchPullRequests';
import FilterBar from './FilterBar';
import PullRequestList from './PullRequestList';
import SignOutButton from './SignOutButton';

/**
 * The page which appears when the user is signed in.
 *
 * @param {object} props - The props to this component.
 * @param {object} props.session - Information about the currently signed in
 * user.
 * @param {Function} props.setSession - A function used to update the current
 * auth session.
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function DashboardPage({ session, setSession }) {
  const [pullRequests, setPullRequests] = useState([]);
  const [isUpdatingPullRequests, setIsUpdatingPullRequests] = useState(false);
  const [hasInitiallyLoadedPullRequests, setHasInitiallyLoadedPullRequests] =
    useState(false);

  const updatePullRequests = useCallback(
    async ({ filters }) => {
      setIsUpdatingPullRequests(true);
      fetchPullRequests({ apiToken: session.apiToken, ...filters }).then(
        (fetchedPullRequests) => {
          setPullRequests(fetchedPullRequests);
          setHasInitiallyLoadedPullRequests(true);
          setIsUpdatingPullRequests(false);
        },
      );
    },
    [session],
  );

  return (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          updatePullRequests={updatePullRequests}
          isUpdatingPullRequests={isUpdatingPullRequests}
          hasInitiallyLoadedPullRequests={hasInitiallyLoadedPullRequests}
        />
        <SignOutButton setSession={setSession} />
      </div>
      <PullRequestList
        pullRequests={pullRequests}
        hasInitiallyLoadedPullRequests={hasInitiallyLoadedPullRequests}
      />
    </>
  );
}

DashboardPage.propTypes = {
  session: PropTypes.shape({
    apiToken: PropTypes.string.isRequired,
  }).isRequired,
  setSession: PropTypes.func.isRequired,
};
