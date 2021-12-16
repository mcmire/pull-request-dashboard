import React from 'react';
import PropTypes from 'prop-types';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import PullRequestRow from './PullRequestRow';

/**
 * The component for the pull request list.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequest[]} props.pullRequests - The pull requests to render.
 * @param {boolean} props.hasInitiallyLoadedPullRequests - Whether or not the
 * first request to fetch PRs has been made.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function PullRequestList({
  pullRequests,
  hasInitiallyLoadedPullRequests,
}) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1"></th>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1"></th>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1"></th>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1">
            Title
          </th>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1">
            <span className="inline-block align-middle">Time</span>
            <TriangleDownIcon className="h-[1.5em] inline-block align-middle" />
          </th>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1">
            Priority
          </th>
          <th className="text-left text-xs font-normal text-gray-500 border-b py-1">
            Statuses
          </th>
        </tr>
      </thead>
      <tbody>
        {hasInitiallyLoadedPullRequests ? (
          pullRequests.map((pullRequest, i) => (
            <PullRequestRow key={i} pullRequest={pullRequest} />
          ))
        ) : (
          <tr>
            <td colSpan={7} className="p-4 text-sm text-gray-500">
              Loading...
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

PullRequestList.propTypes = {
  pullRequests: PropTypes.arrayOf(
    PropTypes.shape({
      isCreatedByMetaMaskian: PropTypes.bool.isRequired,
      authorAvatarUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
      number: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      priorityLevel: PropTypes.number.isRequired,
      statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
  hasInitiallyLoadedPullRequests: PropTypes.bool.isRequired,
};
