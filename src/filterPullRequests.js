import { every, intersection } from 'lodash';

/**
 * Filters the list of pull requests by the specified filters.
 *
 * @param {PullRequest[]} pullRequests - The list of pull requests.
 * @param {object} filters - The filters with which to pare down the list of
 * pull requests.
 * @returns {PullRequest[]} A filtered set of pull requests.
 */
export default function filterPullRequests(pullRequests, filters) {
  return pullRequests.filter((pullRequest) => {
    return (
      !pullRequest.isDraft &&
      !pullRequest.labelNames.includes('DO-NOT-MERGE') &&
      every(
        filters,
        (values, name) => intersection(pullRequest[name], values).length > 0,
      )
    );
  });
}
