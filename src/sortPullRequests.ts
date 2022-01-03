import { partition, sortBy } from 'lodash';
import { SORTABLE_COLUMN_NAMES } from './constants';
import { PullRequest, SortModifiers } from './types';

/**
 * Sorts the given pull requests.
 *
 * @param pullRequests - The pull requests.
 * @param sorts - Information on how to sort.
 * @param sorts.column - The column by which to sort.
 * @param sorts.reverse - Whether or not to reverse the list.
 * @returns The sorted pull requests.
 */
export default function sortPullRequests(
  pullRequests: PullRequest[],
  sorts: SortModifiers | undefined,
): PullRequest[] {
  const defaultSorts = {} as SortModifiers;
  const { column, reverse } = sorts ?? defaultSorts;

  if (column === undefined) {
    return pullRequests;
  }

  const [pullRequestsWithPriorityLevel, pullRequestsWithoutPriorityLevel] =
    column === SORTABLE_COLUMN_NAMES.PRIORITY_LEVEL
      ? partition(pullRequests, (pullRequest) =>
          Boolean(pullRequest.priorityLevel),
        )
      : [pullRequests, []];
  const sortedPullRequests = sortBy(pullRequestsWithPriorityLevel, [
    column,
    'number',
  ]);

  if (reverse === true) {
    sortedPullRequests.reverse();
  }

  return sortedPullRequests.concat(pullRequestsWithoutPriorityLevel);
}
