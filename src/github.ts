import { graphql } from '@octokit/graphql';
import { GitHubViewerResponse, GitHubPullRequestsResponse } from './types2';

const MAX_NUMBER_OF_PULL_REQUESTS = 100;

/**
 * Fetches information about the current viewer (user).
 *
 * @param args - The arguments to this function.
 * @param args.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns The response.
 */
export function fetchViewer({
  apiToken,
}: {
  apiToken: string;
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
      Authorization: `Token ${apiToken}`,
    },
  });
}

/**
 * Fetches pull requests from the `MetaMask/metamask-extension` repository using
 * the specified filters.
 *
 * @param args - The arguments to this function.
 * @param args.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @param [args.after] - Fetch pull requests after this cursor.
 * @returns The response.
 */
export async function fetchPullRequests({
  apiToken,
  after,
}: {
  apiToken: string;
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
    headers: { Authorization: `Token ${apiToken}` },
  });
}
