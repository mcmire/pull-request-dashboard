import { intersection } from 'lodash';
import { ME, MY_TEAM, CONTRIBUTORS } from './constants';

/**
 * Determines whether the given pull request matches the selected author filter.
 *
 * @param {PullRequest} pullRequest - The pull request.
 * @param {"me" | "myTeam" | "contributors"} authorFilter - The user's selection
 * for the Author filter.
 * @param {Session} currentSession - Information about the current user.
 * @returns {boolean} Whether the given pull request matches the selected author
 * filter.
 */
function matchesAuthorFilter(pullRequest, authorFilter, currentSession) {
  if (authorFilter === ME) {
    return pullRequest.author.login === currentSession.user.login;
  }

  const commonTeamLogins = intersection(
    pullRequest.author.teamLogins,
    currentSession.user.teamLogins,
  );

  if (authorFilter === MY_TEAM) {
    return commonTeamLogins.length > 0;
  }

  if (authorFilter === CONTRIBUTORS) {
    return commonTeamLogins.length === 0;
  }

  return false;
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
 * @param {Session} currentSession - Information about the current user.
 * @returns {PullRequest[]} A filtered set of pull requests.
 */
export default function filterPullRequests(
  pullRequests,
  filters,
  currentSession,
) {
  const { author } = filters;
  return pullRequests.filter((pullRequest) => {
    return (
      !pullRequest.isDraft &&
      matchesAuthorFilter(pullRequest, author, currentSession)
    );
  });
}
