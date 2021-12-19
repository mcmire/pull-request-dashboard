import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getPullRequests from '../getPullRequests';
import filterPullRequests from '../filterPullRequests';
import sortPullRequests from '../sortPullRequests';
import FilterBar from './FilterBar';
import PullRequestsTable from './PullRequestsTable';
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
export default function PullRequestsPage({ session, setSession }) {
  const [pullRequestsRequestStatus, setPullRequestsRequestStatus] = useState({
    type: 'pending',
    data: {
      unfilteredPullRequests: [],
      filteredPullRequests: [],
    },
    errorMessage: null,
  });
  const [hasLoadedPullRequestsOnce, setHasLoadedPullRequestsOnce] =
    useState(false);

  // The useCallback here is necessary to prevent recursive state updates
  const updateFilters = useCallback(
    (filters) => {
      setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
        ...previousPullRequestsRequestStatus,
        type: 'loaded',
        data: {
          ...previousPullRequestsRequestStatus.data,
          filteredPullRequests: filterPullRequests(
            previousPullRequestsRequestStatus.data.unfilteredPullRequests,
            filters,
            session,
          ),
        },
      }));
    },
    [session],
  );

  // The useCallback here is necessary to prevent recursive state updates
  const updateSorting = useCallback((sorting) => {
    setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
      ...previousPullRequestsRequestStatus,
      type: 'loaded',
      data: {
        ...previousPullRequestsRequestStatus.data,
        filteredPullRequests: sortPullRequests(
          previousPullRequestsRequestStatus.data.filteredPullRequests,
          sorting,
        ),
      },
    }));
  }, []);

  useEffect(() => {
    setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
      ...previousPullRequestsRequestStatus,
      type: 'loading',
    }));

    getPullRequests(session.apiToken)
      .then((unfilteredPullRequests) => {
        setHasLoadedPullRequestsOnce(true);
        setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
          ...previousPullRequestsRequestStatus,
          type: 'loaded',
          data: {
            ...previousPullRequestsRequestStatus.data,
            unfilteredPullRequests,
          },
        }));
      })
      .catch((error) => {
        setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
          ...previousPullRequestsRequestStatus,
          type: 'error',
          errorMessage: `Couldn't fetch pull requests: ${error}`,
        }));
        console.error(error);
      });
  }, [session]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          pullRequestsRequestStatus={pullRequestsRequestStatus}
          updateFilters={updateFilters}
        />
        <SignOutButton setSession={setSession} />
      </div>
      <PullRequestsTable
        pullRequestsRequestStatus={pullRequestsRequestStatus}
        hasLoadedPullRequestsOnce={hasLoadedPullRequestsOnce}
        updateSorting={updateSorting}
      />
    </>
  );
}

PullRequestsPage.propTypes = {
  session: PropTypes.shape({
    apiToken: PropTypes.string.isRequired,
  }).isRequired,
  setSession: PropTypes.func.isRequired,
};