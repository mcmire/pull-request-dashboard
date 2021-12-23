import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty, reduce } from 'lodash';
import {
  SORTABLE_COLUMN_NAMES,
  DEFAULT_FILTERS,
  DEFAULT_SORTS,
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
import areFilterModifiersEqual from '../areFilterModifiersEqual';
import areSortsEqual from '../areSortsEqual';
import {
  FilterModifiers,
  PullRequest,
  PullRequestsRequestStatus,
  FilterSelectableValues,
  SerializedFilterModifiers,
  SerializedSortModifiers,
  SerializedViewModifiers,
  SortModifiers,
  SortableColumnName,
  ViewModifiers,
} from '../types2';

type Query = {
  [param: string]: string[] | string | undefined;
};

let lastTimeRouterPushCalled: Date | null;

/**
 * Extracts filters and sorts from the given query object, leaving the remaining
 * query parameters.
 *
 * @param query - The query object as obtained via `router.query`.
 * @returns An object, where `filters` are the filter-related parameters,
 * `sorts` are the sort-related parameters, and `rest` is everything else.
 */
function extractViewModifiersFromQuery(
  query: Query,
): ViewModifiers & { rest: Query } {
  const rest = { ...query };
  const filters: FilterModifiers = DEFAULT_FILTERS;
  const sorts: SortModifiers = DEFAULT_SORTS;

  FILTER_NAME_VALUES.forEach((filterName) => {
    const value = rest[`filter_${filterName}`];
    if (value !== undefined) {
      if (filterName === 'authorCategories') {
        filters[filterName] = (
          typeof value === 'string' ? [value] : value
        ) as FilterSelectableValues['authorCategories'];
      } else if (filterName === 'statuses') {
        filters[filterName] = (
          typeof value === 'string' ? [value] : value
        ) as FilterSelectableValues['statuses'];
      }
      delete rest[`filter_${filterName}`];
    }
  });

  const column = rest.sort_column;
  if (typeof column === 'string' && column in SORTABLE_COLUMN_NAMES) {
    sorts.column = column as SortableColumnName;
  }
  delete rest.sort_column;

  const reverse = rest.sort_reverse;
  if (reverse !== undefined) {
    if (reverse === 'true') {
      sorts.reverse = true;
    } else if (reverse === 'false') {
      sorts.reverse = false;
    }
  }
  delete rest.sort_reverse;

  return { filters, sorts, rest };
}

/**
 * Builds a query object from existing parameters, adding the given view
 * modifier parameters. Filter parameters are prefixed with `filter_` and sort
 * parameters are prefixed with `sort_`.
 *
 * @param viewModifiers - The set of view modifiers (an object containing
 * `filters` and/or `sorts` keys).
 * @param [viewModifiers.filters] - The new filters that are being set
 * (optional).
 * @param [viewModifiers.sorts] - The new sorts that are being set (optional).
 * @param query - The existing query parameters.
 * @param query.filters - The existing filters.
 * @param query.sorts - The existing sorts.
 * @param query.rest - The remaining parameters that aren't filter- or
 * sort-related.
 * @returns A combined set of query parameters with view modifier
 * information.
 */
function buildQueryWithViewModifiers(
  {
    filters: newFilters = DEFAULT_FILTERS,
    sorts: newSorts = DEFAULT_SORTS,
  }: Partial<ViewModifiers>,
  {
    filters: oldFilters,
    sorts: oldSorts,
    rest,
  }: ViewModifiers & { rest: Query },
): SerializedViewModifiers {
  const serializedFilters = reduce(
    { ...oldFilters, ...newFilters },
    (obj, value, key) => {
      return { ...obj, [`filter_${key}`]: value };
    },
    {} as SerializedFilterModifiers,
  );

  const serializedSorts = reduce(
    { ...oldSorts, ...newSorts },
    (obj, value, key) => {
      return { ...obj, [`sort_${key}`]: value };
    },
    {} as SerializedSortModifiers,
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
 * @returns The JSX used to render this component.
 */
export default function PullRequestsPage() {
  const router = useRouter();
  const { session } = useSession();
  const [savedViewModifiers, setSavedViewModifiers] = useState<ViewModifiers>({
    filters: DEFAULT_FILTERS,
    sorts: DEFAULT_SORTS,
  });
  const [pullRequestsRequestStatus, setPullRequestsRequestStatus] =
    useState<PullRequestsRequestStatus>({
      type: 'pending',
      data: {
        unfilteredPullRequests: [],
        filteredPullRequests: [],
      },
      errorMessage: null,
    });
  const [hasLoadedPullRequestsOnce, setHasLoadedPullRequestsOnce] =
    useState<boolean>(false);

  const saveViewModifiers = useMemo(() => {
    return async (newViewModifiers: Partial<ViewModifiers>) => {
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
        (existingViewModifiersAndRest.filters !== undefined &&
          newViewModifiers.filters !== undefined &&
          !areFilterModifiersEqual(
            existingViewModifiersAndRest.filters,
            newViewModifiers.filters,
          )) ||
        (existingViewModifiersAndRest.sorts !== undefined &&
          !areSortsEqual(
            existingViewModifiersAndRest.sorts,
            newViewModifiers.sorts,
          ))
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
        await router.push({ query: newQuery }, undefined, { shallow: true });
      }
    };
  }, [router]);

  const saveFilterSelections = (filters: FilterModifiers) =>
    saveViewModifiers({ filters });

  const saveSortModifiers = (sorts: SortModifiers) =>
    saveViewModifiers({ sorts });

  useEffect(() => {
    if (session.type === 'signedOut') {
      router.replace(ROUTES.SIGN_IN);
    }
  }, [session, router]);

  useEffect(() => {
    if (session.type === 'signedIn') {
      setPullRequestsRequestStatus((previousPullRequestsRequestStatus) => ({
        ...previousPullRequestsRequestStatus,
        type: 'loading',
      }));

      getPullRequests(session)
        .then((unfilteredPullRequests: PullRequest[]) => {
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
      saveViewModifiers({ filters, sorts });
    }
  }, [router, saveViewModifiers]);

  return session == null ? null : (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          savedFilterModifiers={savedViewModifiers.filters}
          saveFilterSelections={saveFilterSelections}
        />
        <SignOutButton />
      </div>
      <PullRequestsTable
        pullRequestsRequestStatus={pullRequestsRequestStatus}
        hasLoadedPullRequestsOnce={hasLoadedPullRequestsOnce}
        savedSortModifiers={savedViewModifiers.sorts}
        saveSortModifiers={saveSortModifiers}
      />
    </>
  );
}
