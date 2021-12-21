import { partition, sortBy } from 'lodash';
import { COLUMN_NAMES } from './constants';

/**
 * Sorts the given pull requests.
 *
 * @param {PullRequest[]} pullRequests - The pull requests.
 * @param {object} rest - The rest of the arguments.
 * @param {"createdAt" | "priorityLevel" | "statuses"} rest.column - The column
 * by which to sort.
 * @param {boolean} rest.reverse - Whether or not to reverse the list.
 * @returns {PullRequest[]} The sorted pull requests.
 */
export default function sortPullRequests(pullRequests, { column, reverse }) {
  const [pullRequestsWithPriorityLevel, pullRequestsWithoutPriorityLevel] =
    column === COLUMN_NAMES.PRIORITY_LEVEL
      ? partition(pullRequests, (pullRequest) =>
          Boolean(pullRequest.priorityLevel),
        )
      : [pullRequests, []];
  const sortedPullRequests = sortBy(pullRequestsWithPriorityLevel, [
    column,
    'number',
  ]);

  if (reverse) {
    sortedPullRequests.reverse();
  }

  return sortedPullRequests.concat(pullRequestsWithoutPriorityLevel);
}
