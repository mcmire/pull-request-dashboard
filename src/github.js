const { graphql } = require('@octokit/graphql');

/**
 * Fetches information about the current viewer (user).
 *
 * @param {object} args - The arguments to this function.
 * @param {string} args.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns {Promise<object>} The response.
 */
export function fetchViewer({ apiToken }) {
  return graphql(
    `
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
    `,
    {
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    },
  );
}

/**
 * Fetches pull requests from the `MetaMask/metamask-extension` repository using
 * the specified filters.
 *
 * @param {object} args - The arguments to this function.
 * @param {string} args.apiToken - The token used to authenticate requests to
 * the GitHub API.
 * @returns {Promise<object>} The response.
 */
export async function getPullRequests({ apiToken }) {
  return graphql(
    `
      query {
        repository(owner: "MetaMask", name: "metamask-extension") {
          pullRequests(
            states: [OPEN]
            first: 100
            orderBy: { field: CREATED_AT, direction: DESC }
          ) {
            nodes {
              author {
                login
                avatarUrl
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
    `,
    {
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    },
  );
}
