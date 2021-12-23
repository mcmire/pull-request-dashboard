import { intersection, isEmpty } from 'lodash';
import { FilterModifiers, FilterableColumnName, PullRequest } from './types2';

/**
 * Filters the list of pull requests by the specified filters.
 *
 * @param pullRequests - The list of pull requests.
 * @param filters - The filters with which to pare down the list of pull
 * requests.
 * @returns A filtered set of pull requests.
 */
export default function filterPullRequests(
  pullRequests: PullRequest[],
  filters: FilterModifiers | undefined,
): PullRequest[] {
  if (filters === undefined || isEmpty(filters)) {
    return [];
  }

  return pullRequests.filter((pullRequest) => {
    return (
      !pullRequest.isDraft &&
      !pullRequest.labelNames.includes('DO-NOT-MERGE') &&
      Object.keys(filters).every((key) => {
        const name = key as FilterableColumnName;
        return intersection(pullRequest[name], filters[name]).length > 0;
      })
    );
  });
}
