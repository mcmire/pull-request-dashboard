import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import {
  DEFAULT_SELECTED_FILTERS,
  FILTER_NAME_VALUES,
  ROUTES,
} from '../constants';
import FilterBar from '../components/FilterBar';
import PullRequestsTable from '../components/PullRequestsTable';
import SignOutButton from '../components/SignOutButton';
import { useSession } from '../hooks/session';
import getPullRequests from '../getPullRequests';
import filterPullRequests from '../filterPullRequests';
import sortPullRequests from '../sortPullRequests';
import areFiltersEqual from '../areFiltersEqual';

/**
 * Extracts filters from the given query object, leaving the remaining query
 * parameters.
 *
 * @param {object} query - The query object as obtained via `router.query`.
 * @returns {object} An object, where `filters` are the aforementioned filters
 * and `rest` is the remaining query parameters.
 */
function extractFiltersFromQuery(query) {
  const filters = {};
  const rest = {};

  for (const [key, value] of Object.entries(query)) {
    if (FILTER_NAME_VALUES.includes(key)) {
      filters[key] = typeof value === 'string' ? [value] : value;
    } else {
      rest[key] = value;
    }
  }

  return { filters, rest };
}

/**
 * The page which appears when the user is signed in.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function PullRequestsPage() {
  const router = useRouter();
  const { session } = useSession();
  const [savedSelectedFilters, setSavedSelectedFilters] = useState(null);
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

  const saveSelectedFilters = useCallback(
    (filters) => {
      const { filters: filtersFromQuery, rest } = extractFiltersFromQuery(
        router.query,
      );

      if (!areFiltersEqual(filtersFromQuery, filters)) {
        const query = { ...rest, ...filters };
        router.push({ query }, null, { shallow: true });
      }

      setSavedSelectedFilters(filters);
    },
    [router],
  );

  useEffect(() => {
    if (session === null) {
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

  useEffect(() => {
    const url = new URL(
      router.asPath,
      `${location.protocol}//${location.hostname})`,
    );

    // In development, this may run twice due to Fast Refresh, so prevent the
    // default filters from being used if this is the first time this hook is
    // run
    if (isEmpty(url.searchParams.toString()) || !isEmpty(router.query)) {
      const { filters: filtersFromQuery } = extractFiltersFromQuery(
        router.query,
      );
      if (isEmpty(filtersFromQuery)) {
        saveSelectedFilters(DEFAULT_SELECTED_FILTERS);
      } else {
        saveSelectedFilters(filtersFromQuery);
      }
    }
  }, [router, saveSelectedFilters]);

  return session == null || savedSelectedFilters == null ? null : (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          savedSelectedFilters={savedSelectedFilters}
          saveSelectedFilters={saveSelectedFilters}
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
