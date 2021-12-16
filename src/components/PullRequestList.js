import React from 'react';
import PropTypes from 'prop-types';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import PullRequestRow from './PullRequestRow';
import { PullRequestType } from './types';

/**
 * The component for the pull request list.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequestsRequestStatus} props.pullRequestsRequestStatus - An
 * object that contains information about the request made to fetch pull
 * requests.
 * @param {boolean} props.hasLoadedPullRequestsOnce - Whether or not the
 * first request to fetch pull requests has been made.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function PullRequestList({
  pullRequestsRequestStatus,
  hasLoadedPullRequestsOnce,
}) {
  const renderTbody = () => {
    if (
      pullRequestsRequestStatus.type === 'loaded' &&
      hasLoadedPullRequestsOnce
    ) {
      if (pullRequestsRequestStatus.data.filteredPullRequests.length > 0) {
        return pullRequestsRequestStatus.data.filteredPullRequests.map(
          (pullRequest, i) => (
            <PullRequestRow key={i} pullRequest={pullRequest} />
          ),
        );
      }
      return (
        <tr>
          <td colSpan={7} className="pt-4 pb-4 text-sm">
            No pull requests matched the filters you selected.
          </td>
        </tr>
      );
    } else if (pullRequestsRequestStatus.type === 'error') {
      return (
        <tr>
          <td colSpan={7} className="pt-4 pb-4 text-sm text-red-500">
            {pullRequestsRequestStatus.errorMessage}
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan={7} className="pt-4 pb-4 text-sm text-gray-500 italic">
          Loading, please wait...
        </td>
      </tr>
    );
  };

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
      <tbody>{renderTbody()}</tbody>
    </table>
  );
}

PullRequestList.propTypes = {
  pullRequestsRequestStatus: PropTypes.shape({
    type: PropTypes.string.isRequired,
    data: PropTypes.shape({
      filteredPullRequests: PropTypes.arrayOf(PullRequestType).isRequired,
    }).isRequired,
    errorMessage: PropTypes.string,
  }),
  hasLoadedPullRequestsOnce: PropTypes.bool.isRequired,
};
