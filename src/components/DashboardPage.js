import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';
import { getPullRequests } from '../github';
import FilterBar from './FilterBar';
import PullRequestList from './PullRequestList';
import SignOutButton from './SignOutButton';

/**
 * The page which appears when the user is signed in.
 *
 * @param {object} props - The props to this component.
 * @param {object} props.session - Information about the currently signed in
 * user.
 * @param {Function} props.setSession - A function used to update the current
 * auth session.
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function DashboardPage({ session, setSession }) {
  const [selectedFilters, setSelectedFilters] = useState({
    creator: ['me'],
    status: [],
  });
  const [pullRequests, setPullRequests] = useState([]);

  useEffect(() => {
    console.log('Fetching pull requests...');
    getPullRequests({ apiToken: session.apiToken }).then((response) => {
      const requestedPullRequests = response.repository.pullRequests.nodes.map(
        (pullRequestNode) => {
          const isCreatedByMetaMaskian = pullRequestNode.commits.nodes.some(
            (commitNode) => {
              return commitNode.commit.authors.nodes.some((authorNode) => {
                return (
                  authorNode.user != null &&
                  authorNode.user.organizations.nodes.some(
                    (organizationNode) => {
                      return organizationNode.login === 'MetaMask';
                    },
                  )
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
          return {
            isCreatedByMetaMaskian,
            authorAvatarUrls,
            number,
            title,
            createdAt,
            priorityLevel,
            statuses,
          };
        },
      );
      setPullRequests(requestedPullRequests);
    });
  }, [session]);

  return (
    <>
      <div className="flex justify-between mb-4">
        <FilterBar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <SignOutButton setSession={setSession} />
      </div>
      <PullRequestList pullRequests={pullRequests} />
    </>
  );
}

DashboardPage.propTypes = {
  session: PropTypes.shape({
    apiToken: PropTypes.string.isRequired,
  }).isRequired,
  setSession: PropTypes.func.isRequired,
};
