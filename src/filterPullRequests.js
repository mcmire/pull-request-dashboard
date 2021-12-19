import { intersection } from 'lodash';
import { AUTHOR_FILTER_OPTION_NAMES } from './constants';

/**
 * Determines whether the given pull request matches the selected author filter.
 *
 * @param {PullRequest} pullRequest - The pull request.
 * @param {"me" | "myTeam" | "contributors"} authorFilter - The user's selection
 * for the author filter.
 * @param {Session} currentSession - Information about the current user.
 * @returns {boolean} Whether the given pull request matches the selected author
 * filter.
 */
function matchesAuthorFilter(pullRequest, authorFilter, currentSession) {
  let condition = false;

  if (authorFilter.includes(AUTHOR_FILTER_OPTION_NAMES.ME)) {
    condition ||= pullRequest.author.login === currentSession.user.login;
  }

  const commonTeamLogins = intersection(
    pullRequest.author.teamLogins,
    currentSession.user.teamLogins,
  );

  if (authorFilter.includes(AUTHOR_FILTER_OPTION_NAMES.MY_TEAM)) {
    condition ||= commonTeamLogins.length > 0;
  }

  if (authorFilter.includes(AUTHOR_FILTER_OPTION_NAMES.CONTRIBUTORS)) {
    condition ||= commonTeamLogins.length === 0;
  }

  return condition;
}

/**
 * Determines whether the given pull request matches the selected statuses
 * filter.
 *
 * @param {PullRequest} pullRequest - The pull request.
 * @param {Array<"hasMergeConflicts" | "hasRequiredChanges" | "hasMissingTests" | "isBlocked" | "isReadyToMerge">} statusesFilter -
 * The user's selection for the statuses filter.
 * @returns {boolean} Whether the given pull request matches the selected
 * statuses filter.
 */
function matchesStatusesFilter(pullRequest, statusesFilter) {
  return (
    statusesFilter.length === 0 ||
    intersection(pullRequest.statuses, statusesFilter).length > 0
  );
}

/**
 * Filters the list of pull requests by the specified filters.
 *
 * @param {PullRequest[]} pullRequests - The list of pull requests.
 * @param {object} filters - The filters with which to pare down the list of
 * pull requests.
 * @param {"me" | "myTeam" | "contributors"} filters.author - Filters the list
 * of pull requests by its author (whether it's the current user, the user's
 * team, or not the user's team).
 * @param {Array<"hasMergeConflicts" | "hasRequiredChanges" | "hasMissingTests" | "isBlocked" | "isReadyToMerge">} filters.statuses -
 * Filters the list of pull requests by its status.
 * @param {Session} currentSession - Information about the current user.
 * @returns {PullRequest[]} A filtered set of pull requests.
 */
export default function filterPullRequests(
  pullRequests,
  { author, statuses },
  currentSession,
) {
  return pullRequests.filter((pullRequest) => {
    return (
      !pullRequest.isDraft &&
      matchesAuthorFilter(pullRequest, author, currentSession) &&
      matchesStatusesFilter(pullRequest, statuses)
    );
  });
}
