import { intersection } from 'lodash';
import {
  AUTHOR_CATEGORY_NAMES,
  COLUMN_NAMES,
  FILTER_NAMES,
  STATUS_NAMES,
} from './constants';

/**
 * Builds an author object.
 *
 * @param {GitHubActor} pullRequestAuthor - An Actor object obtained from the
 * GitHub GraphQL API.
 * @returns {Author} An author object.
 */
function buildAuthor(pullRequestAuthor) {
  if (pullRequestAuthor != null) {
    const { login } = pullRequestAuthor;
    const { avatarUrl } = pullRequestAuthor;
    const orgLogins =
      pullRequestAuthor.organizations?.nodes.map(
        (organizationNode) => organizationNode.login,
      ) ?? [];
    return { login, avatarUrl, orgLogins };
  }

  return {
    login: null,
    avatarUrl: 'http://identicon.net/img/identicon.png',
    orgLogins: [],
  };
}

/**
 * Builds the `authorCategories` for an Author.
 *
 * @param {GitHubActor} author - An Author object obtained from {@link
 * buildAuthor}.
 * @param {Session} currentUser - Information about the current user.
 * @returns {PullRequestAuthorCategory[]} A set of categories for the author.
 */
function determineAuthorCategories(author, currentUser) {
  const authorCategories = [];
  const authorInSameOrgAsCurrentUser =
    intersection(author.orgLogins, currentUser.orgLogins).length > 0;

  if (author.login === currentUser.login) {
    authorCategories.push(AUTHOR_CATEGORY_NAMES.ME);
  }

  if (authorInSameOrgAsCurrentUser) {
    authorCategories.push(AUTHOR_CATEGORY_NAMES.MY_TEAM);
  } else {
    authorCategories.push(AUTHOR_CATEGORY_NAMES.CONTRIBUTORS);
  }

  return authorCategories;
}

/**
 * Builds the `statuses` for a PullRequest.
 *
 * @param {GitHubPullRequestNode} pullRequestNode - A PullRequestNode object
 * obtained from the GitHub GraphQL API.
 * @returns {PullRequestStatus[]} A set of statuses for the pull request.
 */
function determineStatuses(pullRequestNode) {
  const statuses = [];

  if (pullRequestNode.reviewDecision === 'REVIEW_REQUIRED') {
    statuses.push(STATUS_NAMES.HAS_REQUIRED_CHANGES);
  } else {
    statuses.push(STATUS_NAMES.IS_READY_TO_MERGE);
  }

  return statuses;
}

/**
 * Builds an object that can be passed to {@link PullRequestRow} to render a
 * pull request.
 *
 * @param {GitHubPullRequestNode} pullRequestNode - A PullRequestNode object obtained
 * from the GitHub GraphQL API.
 * @param {Session} currentUser - Information about the current user.
 * @returns {PullRequest} The pull request.
 */
export default function buildPullRequest(pullRequestNode, currentUser) {
  const {
    number,
    title,
    url,
    isDraft,
    author: pullRequestAuthor,
  } = pullRequestNode;
  const author = buildAuthor(pullRequestAuthor);
  const authorCategories = determineAuthorCategories(author, currentUser);
  const statuses = determineStatuses(pullRequestNode);
  const createdAt = new Date(Date.parse(pullRequestNode.publishedAt));
  const priorityLevel = 1;

  return {
    author,
    [FILTER_NAMES.AUTHOR_CATEGORIES]: authorCategories,
    number,
    title,
    [COLUMN_NAMES.CREATED_AT]: createdAt,
    [COLUMN_NAMES.PRIORITY_LEVEL]: priorityLevel,
    [COLUMN_NAMES.STATUSES]: statuses,
    url,
    isDraft,
  };
}
