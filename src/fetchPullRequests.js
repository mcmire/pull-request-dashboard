import { uniq } from 'lodash';
import { getPullRequests } from './github';

const FAKE_REQUEST = false;
const SHOULD_CACHE = true;
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Builds an object that can be passed to {@link PullRequestRow} to render a
 * pull request.
 *
 * @param {PullRequestNode} pullRequestNode - A object obtained from the GitHub
 * GraphQL API.
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

  const { number } = pullRequestNode;
  const { title } = pullRequestNode;
  const createdAt = new Date(Date.parse(pullRequestNode.publishedAt));
  const priorityLevel = 1;

  const statuses = [];
  if (pullRequestNode.reviewDecision === 'REVIEW_REQUIRED') {
    statuses.push('hasRequiredChanges');
  } else {
    statuses.push('isReadyToMerge');
  }

  const { url } = pullRequestNode;

  return {
    isCreatedByMetaMaskian,
    authorAvatarUrls,
    number,
    title,
    createdAt,
    priorityLevel,
    statuses,
    url,
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

  if (SHOULD_CACHE) {
    const serializedCachedRequest = localStorage.getItem(
      'fetchPullRequestsRequest',
    );

    if (serializedCachedRequest != null) {
      const cachedRequest = JSON.parse(serializedCachedRequest);
      const time = new Date(cachedRequest.time);

      if (
        cachedRequest.params.apiToken === apiToken &&
        new Date().getTime() - time <= CACHE_EXPIRY
      ) {
        return cachedRequest.pullRequests.map((pullRequest) => {
          return {
            ...pullRequest,
            createdAt: new Date(pullRequest.createdAt),
          };
        });
      }
    }
  }

  const response = await getPullRequests({ apiToken });

  const pullRequests =
    response.repository.pullRequests.nodes.map(buildPullRequest);

  if (SHOULD_CACHE) {
    localStorage.setItem(
      'fetchPullRequestsRequest',
      JSON.stringify({
        params: { apiToken },
        time: new Date(),
        pullRequests,
      }),
    );
  }

  return pullRequests;
}
