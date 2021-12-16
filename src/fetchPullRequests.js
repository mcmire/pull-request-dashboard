import { uniq } from 'lodash';
import { getPullRequests } from './github';

const FAKE_REQUEST = false;
const SHOULD_CACHE = true;
const SHOULD_RESET_CACHE = false;
const CACHE_KEY = 'fetchPullRequestsRequest';
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

/**
 * Retrieves pull requests that has been previously persisted to localStorage.
 *
 * @param {string} apiToken - The token used to authenticate requests to the
 * GitHub API.
 * @returns {PullRequest[]} The cached pull requests (before extra filtering).
 */
function fetchPullRequestsFromCache(apiToken) {
  if (SHOULD_RESET_CACHE) {
    localStorage.removeItem(CACHE_KEY);
  }

  const serializedCachedRequest = localStorage.getItem(CACHE_KEY);

  if (serializedCachedRequest != null) {
    const cachedRequest = JSON.parse(serializedCachedRequest);
    const time = new Date(cachedRequest.time);

    if (
      cachedRequest.params.apiToken === apiToken &&
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
 * @param {string} apiToken - The token used to authenticate requests to the
 * GitHub API.
 * @returns {Promise<PullRequest[]>} A set of pull requests (before extra
 * filtering).
 */
async function fetchPullRequestsFromApi(apiToken) {
  const response = await getPullRequests({ apiToken });

  const pullRequests =
    response.repository.pullRequests.nodes.map(buildPullRequest);

  if (SHOULD_CACHE) {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        params: { apiToken },
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
  const isCreatedByMetaMaskian = pullRequestNode.commits.nodes.some(
    (commitNode) => {
      return commitNode.commit.authors.nodes.some((authorNode) => {
        return (
          authorNode.user != null &&
          authorNode.user.organizations.nodes.some((organizationNode) => {
            return organizationNode.login === 'MetaMask';
          })
        );
      });
    },
  );

  const authorAvatarUrls = uniq(
    pullRequestNode.commits.nodes.flatMap((commitNode) => {
      return commitNode.commit.authors.nodes.map((authorNode) => {
        if (authorNode.user != null) {
          return authorNode.user.avatarUrl;
        }
        // TODO
        return 'http://identicon.net/img/identicon.png';
      });
    }),
  );

  const { number, title, url, isDraft } = pullRequestNode;
  const createdAt = new Date(Date.parse(pullRequestNode.publishedAt));
  const priorityLevel = 1;

  const statuses = [];
  if (pullRequestNode.reviewDecision === 'REVIEW_REQUIRED') {
    statuses.push('hasRequiredChanges');
  } else {
    statuses.push('isReadyToMerge');
  }

  return {
    isCreatedByMetaMaskian,
    authorAvatarUrls,
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
 * @param {object} args - The arguments to this function.
 * @param {string} args.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns {Promise<PullRequest>} The pull requests.
 */
export default async function fetchPullRequests({ apiToken }) {
  if (FAKE_REQUEST) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 3000);
    });
  }

  const pullRequestsBeforeExtraFiltering =
    (SHOULD_CACHE && fetchPullRequestsFromCache(apiToken)) ||
    (await fetchPullRequestsFromApi(apiToken));

  return pullRequestsBeforeExtraFiltering.filter((pullRequest) => {
    return !pullRequest.isDraft;
  });
}
