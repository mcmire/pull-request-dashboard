import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty, reduce } from 'lodash';
import {
  DEFAULT_SELECTED_FILTERS,
  DEFAULT_SORTS,
  FILTER_NAME_VALUES,
  SORT_FLAG_VALUES,
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
import areSortsEqual from '../areSortsEqual';

let lastTimeRouterPushCalled;

/**
 * Extracts filters and sorts from the given query object, leaving the remaining
 * query parameters.
 *
 * @param {object} query - The query object as obtained via `router.query`.
 * @returns {object} An object, where `filters` are the filter-related
 * parameters, `sorts` are the sort-related parameters, and `rest` is everything
 * else.
 */
function extractViewModifiersFromQuery(query) {
  const rest = { ...query };
  let filters = {};
  let sorts;

  FILTER_NAME_VALUES.forEach((filterName) => {
    const value = rest[`filter_${filterName}`];
    if (value !== undefined) {
      filters[filterName] = typeof value === 'string' ? [value] : value;
      delete rest[`filter_${filterName}`];
    } else {
      filters[filterName] = [];
    }
  });

  if (Object.values(filters).flat().length === 0) {
    filters = undefined;
  }

  SORT_FLAG_VALUES.forEach((sortFlag) => {
    const value = rest[`sort_${sortFlag}`];
    if (value !== undefined) {
      let normalizedValue = value;
      if (value === 'true') {
        normalizedValue = true;
      } else if (value === 'false') {
        normalizedValue = false;
      }

      if (sorts === undefined) {
        sorts = {};
      }
      sorts[sortFlag] = normalizedValue;
      delete rest[`sort_${sortFlag}`];
    }
  });

  return { filters, sorts, rest };
}

/**
 * Builds a query object from existing parameters, adding the given view
 * modifier parameters. Filter parameters are prefixed with `filter_` and sort
 * parameters are prefixed with `sort_`.
 *
 * @param {object} viewModifiers - The set of view modifiers (an object
 * containing `filters` and/or `sorts` keys).
 * @param {object} [viewModifiers.filters] - The new filters that are being set.
 * @param {object} [viewModifiers.sorts] - The new sorts that are being set.
 * @param {object} query - The existing query parameters.
 * @param {object} query.filters - The existing filters.
 * @param {object} query.sorts - The existing sorts.
 * @param {object} query.rest - The remaining parameters that aren't filter- or
 * sort-related.
 * @returns {object} A combined set of query parameters with view modifier
 * information.
 */
function buildQueryWithViewModifiers(
  { filters: newFilters = {}, sorts: newSorts = {} },
  { filters: oldFilters, sorts: oldSorts, rest },
) {
  const serializedFilters = reduce(
    { ...oldFilters, ...newFilters },
    (obj, value, key) => {
      return { ...obj, [`filter_${key}`]: value };
    },
    {},
  );

  const serializedSorts = reduce(
    { ...oldSorts, ...newSorts },
    (obj, value, key) => {
      return { ...obj, [`sort_${key}`]: value };
    },
    {},
  );

  return {
    ...rest,
    ...serializedFilters,
    ...serializedSorts,
  };
}

/**
 * The page which appears when the user is signed in.
 *
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function PullRequestsPage() {
  const router = useRouter();
  const { session } = useSession();
  const [savedViewModifiers, setSavedViewModifiers] = useState(null);
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

  const saveViewModifiers = useMemo(() => {
    return async (newViewModifiers) => {
      const existingViewModifiersAndRest = extractViewModifiersFromQuery(
        router.query,
      );
      const newQuery = buildQueryWithViewModifiers(
        newViewModifiers,
        existingViewModifiersAndRest,
      );

      setSavedViewModifiers((previousSavedViewModifiers) => ({
        ...previousSavedViewModifiers,
        ...newViewModifiers,
      }));

      if (
        !areFiltersEqual(
          existingViewModifiersAndRest.filters,
          newViewModifiers.filters,
        ) ||
        !areSortsEqual(
          existingViewModifiersAndRest.sorts,
          newViewModifiers.sorts,
        )
      ) {
        if (
          lastTimeRouterPushCalled != null &&
          new Date().getTime() - lastTimeRouterPushCalled.getTime() <= 200
        ) {
          console.log(
            'newViewModifiers',
            newViewModifiers,
            'existingViewModifiersAndRest',
            existingViewModifiersAndRest,
            'newQuery',
            newQuery,
          );
          throw new Error(
            'router.push() was already called a split-second ago. You may be in an infinite loop.',
          );
        }
        lastTimeRouterPushCalled = new Date();
        await router.push({ query: newQuery }, null, { shallow: true });
      }
    };
  }, [router]);

  const saveSelectedFilters = (filters) => saveViewModifiers({ filters });

  const saveSorts = (sorts) => saveViewModifiers({ sorts });

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
    if (
      pullRequestsRequestStatus.type === 'loaded' &&
      savedViewModifiers != null
    ) {
      setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
        ...previousPullRequestsRequestStatus,
        type: 'loaded',
        data: {
          ...previousPullRequestsRequestStatus.data,
          filteredPullRequests: sortPullRequests(
            filterPullRequests(
              previousPullRequestsRequestStatus.data.unfilteredPullRequests,
              savedViewModifiers.filters,
            ),
            savedViewModifiers.sorts,
          ),
        },
      }));
    }
  }, [pullRequestsRequestStatus.type, savedViewModifiers]);

  useEffect(() => {
    const url = new URL(
      router.asPath,
      `${location.protocol}//${location.hostname})`,
    );

    // In development, this may run twice due to Fast Refresh, so prevent the
    // default filters from being used if this is the first time this hook is
    // run
    if (isEmpty(url.searchParams.toString()) || !isEmpty(router.query)) {
      const { filters, sorts } = extractViewModifiersFromQuery(router.query);
      const newFilters =
        filters === undefined ? DEFAULT_SELECTED_FILTERS : filters;
      const newSorts = sorts === undefined ? DEFAULT_SORTS : sorts;
      saveViewModifiers({ filters: newFilters, sorts: newSorts });
    }
  }, [router, saveViewModifiers]);

  return session == null || savedViewModifiers == null ? null : (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          savedSelectedFilters={savedViewModifiers.filters}
          saveSelectedFilters={saveSelectedFilters}
        />
        <SignOutButton />
      </div>
      <PullRequestsTable
        pullRequestsRequestStatus={pullRequestsRequestStatus}
        hasLoadedPullRequestsOnce={hasLoadedPullRequestsOnce}
        savedSorts={savedViewModifiers.sorts}
        saveSorts={saveSorts}
      />
    </>
  );
}

PullRequestsPage.propTypes = {};
