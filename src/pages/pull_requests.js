import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DEFAULT_SELECTED_FILTERS, ROUTES } from '../constants';
import FilterBar from '../components/FilterBar';
import PullRequestsTable from '../components/PullRequestsTable';
import SignOutButton from '../components/SignOutButton';
import { useSession } from '../hooks/session';
import getPullRequests from '../getPullRequests';
import filterPullRequests from '../filterPullRequests';
import sortPullRequests from '../sortPullRequests';

/**
 * The page which appears when the user is signed in.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function PullRequestsPage() {
  const router = useRouter();
  const { session } = useSession();
  const [savedSelectedFilters, setSavedSelectedFilters] = useState(
    DEFAULT_SELECTED_FILTERS,
  );
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
    if (session == null) {
      router.replace(ROUTES.SIGN_IN);
    }
  }, [session, router]);

  useEffect(() => {
    if (session != null) {
      setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
        ...previousPullRequestsRequestStatus,
        type: 'loading',
      }));

      getPullRequests(session)
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
    }
  }, [session]);

  // The useCallback here is necessary to prevent recursive state updates
  useEffect(() => {
    if (pullRequestsRequestStatus.type === 'loaded') {
      setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
        ...previousPullRequestsRequestStatus,
        type: 'loaded',
        data: {
          ...previousPullRequestsRequestStatus.data,
          filteredPullRequests: filterPullRequests(
            previousPullRequestsRequestStatus.data.unfilteredPullRequests,
            savedSelectedFilters,
          ),
        },
      }));
    }
  }, [pullRequestsRequestStatus.type, savedSelectedFilters]);

  return session == null ? null : (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          savedSelectedFilters={savedSelectedFilters}
          setSavedSelectedFilters={setSavedSelectedFilters}
        />
        <SignOutButton />
      </div>
      <PullRequestsTable
        pullRequestsRequestStatus={pullRequestsRequestStatus}
        hasLoadedPullRequestsOnce={hasLoadedPullRequestsOnce}
        updateSorting={updateSorting}
      />
    </>
  );
}

PullRequestsPage.propTypes = {};
