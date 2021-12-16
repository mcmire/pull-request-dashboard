const { graphql } = require('@octokit/graphql');

/**
 * Ensures that the given GitHub API token is correct by making a request to the
 * API using it.
 *
 * @param {string} apiToken - The API token you want to test.
 * @returns {boolean} Whether the given API token is valid.
 */
export async function validateApiToken(apiToken) {
  try {
    await graphql(
      `
        query {
          viewer {
            login
          }
        }
      `,
      {
        headers: {
          Authorization: `Token ${apiToken}`,
        },
      },
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Fetches pull requests from the `MetaMask/metamask-extension` repository using
 * the specified filters.
 *
 * @param {object} args - The arguments to this function.
 * @param {string} args.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns {Promise<GetPullRequestsResponse>} The response.
 */
export async function getPullRequests({ apiToken }) {
  return graphql(
    `
      query {
        repository(owner: "MetaMask", name: "metamask-extension") {
          pullRequests(
            states: [OPEN]
            first: 20
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            nodes {
              author {
                login
              }
              commits(first: 100) {
                nodes {
                  commit {
                    authors(first: 5) {
                      nodes {
                        user {
                          login
                          avatarUrl
                          organizations(first: 5) {
                            nodes {
                              login
                            }
                          }
                        }
                        name
                        email
                      }
                    }
                  }
                }
              }
              number
              title
              isDraft
              labels(first: 100) {
                nodes {
                  name
                }
              }
              mergeable
              milestone {
                title
              }
              participants(first: 100) {
                nodes {
                  login
                }
              }
              projectCards(archivedStates: [NOT_ARCHIVED]) {
                nodes {
                  project {
                    name
                  }
                }
              }
              projectsNext(first: 100) {
                nodes {
                  title
                }
              }
              publishedAt
              reviewDecision
              viewerDidAuthor
            }
          }
        }
      }
    `,
    {
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    },
  );
}
