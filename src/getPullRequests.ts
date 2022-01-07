import { isEqual } from 'lodash';
import { fetchPullRequestsWithAutomaticRetry } from './github';
import buildPullRequest from './buildPullRequest';
import { PullRequest, SignedInSession, SignedInUser } from './types';

const FAKE_REQUEST = false;
const CACHE_KEY = 'fetchPullRequestsRequest/v2';
const SHOULD_CACHE = true;
const SHOULD_RESET_CACHE = false;
const SHOULD_EXPIRE_CACHE = true;
const CACHE_EXPIRES_BEFORE = new Date(1641159515259);
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

let lastTimeFetched: Date | undefined;

type RequestParams = {
  accessToken: string;
};
export type PullRequestsCapture = {
  requestParams: RequestParams;
  pullRequests: PullRequest[];
  requestTime: Date;
};

/**
 * Retrieves pull requests that has been previously persisted to localStorage.
 *
 * @param params - The request params.
 * @param cacheExpiresBefore - Specifies how an existing cache should be
 * handled. If it was created before this date, then it will be discarded and a
 * new request will be performed.
 * @returns The cached pull requests (before extra filtering).
 */
function getPullRequestsFromCache(
  params: RequestParams,
  cacheExpiresBefore: Date | null,
): PullRequestsCapture | null {
  if (SHOULD_RESET_CACHE) {
    localStorage.removeItem(CACHE_KEY);
  }

  const serializedPullRequestsCapture = localStorage.getItem(CACHE_KEY);

  if (serializedPullRequestsCapture != null) {
    const capture = JSON.parse(
      serializedPullRequestsCapture,
    ) as PullRequestsCapture;
    const time = new Date(capture.requestTime);

    if (
      SHOULD_EXPIRE_CACHE &&
      time >= CACHE_EXPIRES_BEFORE &&
      (cacheExpiresBefore == null || time >= cacheExpiresBefore) &&
      isEqual(capture.requestParams, params) &&
      new Date().getTime() - time.getTime() <= CACHE_MAX_AGE
    ) {
      return {
        ...capture,
        pullRequests: capture.pullRequests.map((pullRequest) => {
          return {
            ...pullRequest,
            createdAt: new Date(pullRequest.createdAt),
          };
        }),
        requestTime: time,
      };
    }
  }

  return null;
}

/**
 * Retrieves pull requests from the API and builds PullRequest objects from
 * them.
 *
 * @param params - The data which specifies the request.
 * @param params.accessToken - The token used to authenticate requests to
 * the GitHub API.
 * @param currentUser - Information about the current user.
 * @returns A set of pull requests (before extra filtering).
 */
async function fetchPullRequestsFromApi(
  params: RequestParams,
  currentUser: SignedInUser,
): Promise<PullRequestsCapture> {
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

  const githubPullRequestNodes = [];
  let response = await fetchPullRequestsWithAutomaticRetry(params);
  githubPullRequestNodes.push(...response.repository.pullRequests.nodes);

  while (response.repository.pullRequests.pageInfo.hasNextPage) {
    response = await fetchPullRequestsWithAutomaticRetry({
      ...params,
      after: response.repository.pullRequests.pageInfo.endCursor,
    });
    githubPullRequestNodes.push(...response.repository.pullRequests.nodes);
  }

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

  return { requestParams: params, pullRequests, requestTime: now };
}

/**
 * Fetches pull requests from GitHub using the specified filters and then maps
 * them to a form that can be passed to the PullRequestList.
 *
 * @param currentSession - Information about the current user.
 * @param cacheExpiresBefore - Specifies how an existing cache should be
 * handled. If it was created before this date, then it will be discarded and a
 * new request will be performed.
 * @returns The pull requests.
 */
export default async function getPullRequests(
  currentSession: SignedInSession,
  cacheExpiresBefore: Date | null,
): Promise<PullRequestsCapture> {
  const { accessToken, user } = currentSession;
  const params = { accessToken };

  if (FAKE_REQUEST) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            requestParams: params,
            pullRequests: [],
            requestTime: new Date(),
          }),
        3000,
      );
    });
  }

  return (
    (SHOULD_CACHE && getPullRequestsFromCache(params, cacheExpiresBefore)) ||
    (await fetchPullRequestsFromApi(params, user))
  );
}
