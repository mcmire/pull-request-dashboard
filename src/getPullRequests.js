import { isEqual } from 'lodash';
import { fetchPullRequests } from './github';
import { HAS_REQUIRED_CHANGES, IS_READY_TO_MERGE } from './constants';

const FAKE_REQUEST = false;
const SHOULD_CACHE = true;
const SHOULD_RESET_CACHE = false;
const CACHE_KEY = 'fetchPullRequestsRequest';
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour
let lastTimeFetched;

/**
 * Retrieves pull requests that has been previously persisted to localStorage.
 *
 * @param {object} params - The data which specifies the request.
 * @param {string} params.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns {PullRequest[]} The cached pull requests (before extra filtering).
 */
function getPullRequestsFromCache(params) {
  if (SHOULD_RESET_CACHE) {
    localStorage.removeItem(CACHE_KEY);
  }

  const serializedCachedRequest = localStorage.getItem(CACHE_KEY);

  if (serializedCachedRequest != null) {
    const cachedRequest = JSON.parse(serializedCachedRequest);
    const time = new Date(cachedRequest.time);

    if (
      isEqual(cachedRequest.params, params) &&
      new Date().getTime() - time <= CACHE_MAX_AGE
    ) {
      return cachedRequest.pullRequests.map((pullRequest) => {
        return {
          ...pullRequest,
          createdAt: new Date(pullRequest.createdAt),
        };
      });
    }
  }

  return null;
}

/**
 * Retrieves pull requests from the API and builds PullRequest objects from
 * them.
 *
 * @param {object} params - The data which specifies the request.
 * @param {string} params.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns {Promise<PullRequest[]>} A set of pull requests (before extra
 * filtering).
 */
async function fetchPullRequestsFromApi(params) {
  const now = new Date().getTime();

  if (now - lastTimeFetched <= 500) {
    throw new Error(
      'It looks like a duplicate request was made to the GitHub API. ' +
        "Make sure you're not in an infinite loop, as this will cause rate limiting.",
    );
  }

  lastTimeFetched = now;

  const githubPullRequestNodes = [];
  let response = await fetchPullRequests(params);
  githubPullRequestNodes.push(...response.repository.pullRequests.nodes);

  while (response.repository.pullRequests.pageInfo.hasNextPage) {
    response = await fetchPullRequests({
      ...params,
      after: response.repository.pullRequests.pageInfo.endCursor,
    });
    githubPullRequestNodes.push(...response.repository.pullRequests.nodes);
  }

  const pullRequests = githubPullRequestNodes.map(buildPullRequest);

  if (SHOULD_CACHE) {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        params,
        time: new Date(),
        pullRequests,
      }),
    );
  }

  return pullRequests;
}

/**
 * Builds an object that can be passed to {@link PullRequestRow} to render a
 * pull request.
 *
 * @param {PullRequestNode} pullRequestNode - A PullRequestNode object obtained
 * from the GitHub GraphQL API.
 * @returns {PullRequest} The pull request.
 */
function buildPullRequest(pullRequestNode) {
  const {
    number,
    title,
    url,
    isDraft,
    author: pullRequestAuthor,
  } = pullRequestNode;

  let author;
  if (pullRequestAuthor != null) {
    const { login } = pullRequestAuthor;
    const { avatarUrl } = pullRequestAuthor;
    const teamLogins =
      pullRequestAuthor.organizations?.nodes.map(
        (organizationNode) => organizationNode.login,
      ) ?? [];
    author = { login, avatarUrl, teamLogins };
  } else {
    author = {
      login: null,
      avatarUrl: 'http://identicon.net/img/identicon.png',
      teamLogins: [],
    };
  }

  const statuses = [];
  if (pullRequestNode.reviewDecision === 'REVIEW_REQUIRED') {
    statuses.push(HAS_REQUIRED_CHANGES);
  } else {
    statuses.push(IS_READY_TO_MERGE);
  }

  const createdAt = new Date(Date.parse(pullRequestNode.publishedAt));
  const priorityLevel = 1;

  return {
    author,
    number,
    title,
    createdAt,
    priorityLevel,
    statuses,
    url,
    isDraft,
  };
}

/**
 * Fetches pull requests from GitHub using the specified filters and then maps
 * them to a form that can be passed to the PullRequestList.
 *
 * @param {string} apiToken - The token used to authenticate requests to the
 * GitHub API.
 * @returns {Promise<PullRequest>} The pull requests.
 */
export default async function getPullRequests(apiToken) {
  if (FAKE_REQUEST) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 3000);
    });
  }

  const pullRequests =
    (SHOULD_CACHE && getPullRequestsFromCache({ apiToken })) ||
    (await fetchPullRequestsFromApi({ apiToken }));

  return pullRequests;
}
