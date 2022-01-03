import { intersection, uniq } from 'lodash';
import {
  AUTHOR_CATEGORY_NAMES,
  SORTABLE_COLUMN_NAMES,
  FILTERABLE_COLUMN_NAMES,
  STATUS_NAMES,
} from './constants';
import {
  GitHubPullRequestAuthor,
  GitHubPullRequest,
  PullRequest,
  PullRequestAuthor,
  FilterSelectableValues,
  SignedInUser,
} from './types';

/**
 * Builds an author object.
 *
 * @param pullRequestAuthor - An Actor object obtained from the GitHub GraphQL
 * API.
 * @returns An author object.
 */
function buildAuthor(
  pullRequestAuthor: GitHubPullRequestAuthor,
): PullRequestAuthor {
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
    login: 'ghost',
    avatarUrl: 'https://avatars.githubusercontent.com/u/10137?v=4',
    orgLogins: [],
  };
}

/**
 * Builds the `authorCategories` for an Author.
 *
 * @param author - An Author object obtained from {@link buildAuthor}.
 * @param currentUser - Information about the current user.
 * @returns A set of categories for the author.
 */
function determineAuthorCategories(
  author: PullRequestAuthor,
  currentUser: SignedInUser,
): FilterSelectableValues['authorCategories'] {
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

  return authorCategories as FilterSelectableValues['authorCategories'];
}

/**
 * Determines the `statuses` for a PullRequest.
 *
 * @param pullRequestNode - A PullRequest object obtained from the GitHub
 * GraphQL API.
 * @returns A set of statuses for the pull request.
 */
function determineStatuses(
  pullRequestNode: GitHubPullRequest,
): FilterSelectableValues['statuses'] {
  const statuses = [];
  const labelNames = pullRequestNode.labels.nodes.map((label) => label.name);

  if (pullRequestNode.reviewDecision === 'REVIEW_REQUIRED') {
    statuses.push(STATUS_NAMES.NEEDS_REVIEW);
  } else if (pullRequestNode.reviewDecision === 'CHANGES_REQUESTED') {
    statuses.push(STATUS_NAMES.HAS_REQUIRED_CHANGES);
  }

  if (pullRequestNode.mergeable === 'CONFLICTING') {
    statuses.push(STATUS_NAMES.HAS_MERGE_CONFLICTS);
  }

  if (
    pullRequestNode.commits.nodes[0].commit.status?.contexts.some(
      (context) => context.state === 'FAILURE',
    )
  ) {
    statuses.push(STATUS_NAMES.HAS_FAILING_REQUIRED_CHECKS);
  }

  if (statuses.length === 0) {
    statuses.push(STATUS_NAMES.IS_READY_TO_MERGE);
  }

  if (labelNames.includes('blocked')) {
    statuses.push(STATUS_NAMES.IS_BLOCKED);
  }

  if (labelNames.includes('needs-tests')) {
    statuses.push(STATUS_NAMES.HAS_MISSING_TESTS);
  }

  return statuses as FilterSelectableValues['statuses'];
}

/**
 * Determines the `priorityLevel` for a PullRequest.
 *
 * @param pullRequestNode - A PullRequest object obtained from the GitHub
 * GraphQL API.
 * @returns The priority level from 0 to 5.
 */
function determinePriorityLevel(pullRequestNode: GitHubPullRequest): number {
  const issueReferenceLabelNames = uniq(
    pullRequestNode.closingIssuesReferences.nodes.flatMap((issueNode) =>
      issueNode.labels.nodes.map((label) => label.name),
    ),
  );

  if (issueReferenceLabelNames.includes('Sev0-urgent')) {
    return 4;
  } else if (issueReferenceLabelNames.includes('Sev1-high')) {
    return 3;
  } else if (issueReferenceLabelNames.includes('Sev2-normal')) {
    return 2;
  } else if (issueReferenceLabelNames.includes('Sev3-low')) {
    return 1;
  }

  return 0;
}

/**
 * Builds an object that can be passed to {@link PullRequestRow} to render a
 * pull request.
 *
 * @param pullRequestNode - A PullRequestNode object obtained from the GitHub
 * GraphQL API.
 * @param currentUser - Information about the current user.
 * @returns The built pull request.
 */
export default function buildPullRequest(
  pullRequestNode: GitHubPullRequest,
  currentUser: SignedInUser,
): PullRequest {
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
  const priorityLevel = determinePriorityLevel(pullRequestNode);
  const createdAt = new Date(Date.parse(pullRequestNode.publishedAt));
  const labelNames = pullRequestNode.labels.nodes.map((label) => label.name);

  return {
    author,
    [FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES]: authorCategories,
    number,
    title,
    [SORTABLE_COLUMN_NAMES.CREATED_AT]: createdAt,
    [SORTABLE_COLUMN_NAMES.PRIORITY_LEVEL]: priorityLevel,
    [SORTABLE_COLUMN_NAMES.STATUSES]: statuses,
    url,
    isDraft,
    isCreatedByMetaMaskian: author.orgLogins.includes('MetaMask'),
    labelNames,
  };
}
