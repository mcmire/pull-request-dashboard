import { graphql } from '@octokit/graphql';
import { GitHubViewerResponse, GitHubPullRequestsResponse } from './types';

const MAX_NUMBER_OF_PULL_REQUESTS = 100;

/**
 * Fetches information about the current viewer (user).
 *
 * @param args - The arguments to this function.
 * @param args.accessToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns The response.
 */
export function fetchViewer({
  accessToken,
}: {
  accessToken: string;
}): Promise<GitHubViewerResponse> {
  const query = `
    query {
      viewer {
        login
        organizations(first: 5) {
          nodes {
            login
          }
        }
      }
    }
  `;
  return graphql<GitHubViewerResponse>(query, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Fetches pull requests from the `MetaMask/metamask-extension` repository using
 * the specified filters.
 *
 * @param args - The arguments to this function.
 * @param args.accessToken - The token used to authenticate requests to
 * the GitHub API.
 * @param [args.after] - Fetch pull requests after this cursor.
 * @returns The response.
 */
export async function fetchPullRequests({
  accessToken,
  after,
}: {
  accessToken: string;
  after?: string;
}): Promise<GitHubPullRequestsResponse> {
  const query = `
    query {
      repository(owner: "MetaMask", name: "metamask-extension") {
        pullRequests(
          states: [OPEN]
          first: ${MAX_NUMBER_OF_PULL_REQUESTS}
          ${after != null ? `after: "${after}"` : ''}
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
          nodes {
            author {
              avatarUrl
              login
              ... on User {
                organizations(first: 10) {
                  nodes {
                    login
                  }
                }
              }
              ... on EnterpriseUserAccount {
                organizations(first: 10) {
                  nodes {
                    login
                  }
                }
              }
            }
            closingIssuesReferences(first: 5) {
              nodes {
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
            commits(last: 1) {
              nodes {
                commit {
                  message
                  status {
                    contexts {
                      state
                    }
                  }
                }
              }
            }
            number
            title
            isDraft
            labels(first: 10) {
              nodes {
                name
              }
            }
            mergeable
            milestone {
              title
            }
            projectCards(archivedStates: [NOT_ARCHIVED]) {
              nodes {
                project {
                  name
                }
              }
            }
            projectsNext(first: 5) {
              nodes {
                title
              }
            }
            publishedAt
            reviewDecision
            url
            viewerDidAuthor
          }
        }
      }
    }
  `;
  return graphql<GitHubPullRequestsResponse>(query, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * Fetches pull requests from the `MetaMask/metamask-extension` repository using
 * the specified filters. As sometimes the GitHub API can time out, this
 * function automatically retries the request for up to 3 times.
 *
 * @param params - The request params.
 * @param params.accessToken - The token used to authenticate requests to
 * the GitHub API.
 * @param [params.after] - Fetch pull requests after this cursor.
 * @returns A set of pull requests (before extra filtering).
 */
export async function fetchPullRequestsWithAutomaticRetry(params: {
  accessToken: string;
  after?: string;
}): Promise<GitHubPullRequestsResponse> {
  let numberOfRetries = 0;

  /* eslint-disable no-constant-condition */
  while (true) {
    try {
      return await fetchPullRequests(params);
    } catch (error: any) {
      if (
        error.message != null &&
        (/Unexpected end of JSON input/u.test(error.message) ||
          /Something went wrong while executing your query\. This may be the result of a timeout/u.test(
            error.message,
          )) &&
        numberOfRetries < 3
      ) {
        numberOfRetries += 1;
      } else {
        throw error;
      }
    }
  }
}
