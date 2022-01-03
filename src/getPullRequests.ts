import { isEqual } from 'lodash';
import { fetchPullRequests } from './github';
import buildPullRequest from './buildPullRequest';
import { PullRequest, SignedInSession, SignedInUser } from './types';

const FAKE_REQUEST = false;
const CACHE_KEY = 'fetchPullRequestsRequest';
const SHOULD_CACHE = true;
const SHOULD_RESET_CACHE = false;
const SHOULD_EXPIRE_CACHE = true;
const EXPIRE_CACHE_BEFORE = new Date(1641159515259);
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

let lastTimeFetched: Date | undefined;

type RequestParams = {
  apiToken: string;
};
type CachedRequest = {
  params: RequestParams;
  time: Date;
  pullRequests: PullRequest[];
};

/**
 * Retrieves pull requests that has been previously persisted to localStorage.
 *
 * @param params - The request params.
 * @returns The cached pull requests (before extra filtering).
 */
function getPullRequestsFromCache(params: RequestParams) {
  if (SHOULD_RESET_CACHE) {
    localStorage.removeItem(CACHE_KEY);
  }

  const serializedCachedRequest = localStorage.getItem(CACHE_KEY);

  if (serializedCachedRequest != null) {
    const cachedRequest = JSON.parse(serializedCachedRequest) as CachedRequest;
    const time = new Date(cachedRequest.time);

    if (
      SHOULD_EXPIRE_CACHE &&
      time >= EXPIRE_CACHE_BEFORE &&
      isEqual(cachedRequest.params, params) &&
      new Date().getTime() - time.getTime() <= CACHE_MAX_AGE
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
 * @param params - The data which specifies the request.
 * @param params.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @param currentUser - Information about the current user.
 * @returns A set of pull requests (before extra
 * filtering).
 */
async function fetchPullRequestsFromApi(
  params: RequestParams,
  currentUser: SignedInUser,
) {
  const now = new Date();

  if (
    lastTimeFetched !== undefined &&
    now.getTime() - lastTimeFetched.getTime() <= 100
  ) {
    throw new Error(
      'It looks like a duplicate request was made to the GitHub API. ' +
        "Make sure you're not in an infinite loop, as this will cause rate limiting.",
    );
  }

  lastTimeFetched = now;

  // TODO: Handle timeout errors such as:
  //
  //   Couldn't fetch pull requests: HttpError: Unknown error:
  //   {"data":null,"errors":[{"message":"Something went wrong while executing
  //   your query. This may be the result of a timeout, or it could be a GitHub
  //   bug. Please include `EC66:6A6B:3195096:9673C6A:61D21A5E` when reporting
  //   this issue."}]}

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

  //console.log('githubPullRequestNodes', githubPullRequestNodes);

  const pullRequests = githubPullRequestNodes.map((pullRequestNode) =>
    buildPullRequest(pullRequestNode, currentUser),
  );

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
 * Fetches pull requests from GitHub using the specified filters and then maps
 * them to a form that can be passed to the PullRequestList.
 *
 * @param currentSession - Information about the current user.
 * @returns The pull requests.
 */
export default async function getPullRequests(
  currentSession: SignedInSession,
): Promise<PullRequest[]> {
  const { apiToken, user } = currentSession;

  if (FAKE_REQUEST) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 3000);
    });
  }

  const pullRequests =
    (SHOULD_CACHE && getPullRequestsFromCache({ apiToken })) ||
    (await fetchPullRequestsFromApi({ apiToken }, user));

  //console.log('pullRequests', pullRequests);

  return pullRequests;
}
