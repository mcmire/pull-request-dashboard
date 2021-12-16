import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import friendlyTime from 'friendly-time';
import MetamaskIcon from '../images/metamask-fox.svg';
import DotIcon from '../images/icons/octicons/dot-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import { times } from '../util';

const MAX_PRIORITY_LEVEL = 5;
const STATUSES_BY_NAME = {
  hasMergeConflicts: 'Has merge conflicts',
  hasRequiredChanges: 'Has required changes',
  hasMissingTests: 'Missing tests',
  isBlocked: 'Blocked by dependent task',
  isReadyToMerge: 'Ready to merge',
};

/**
 * The component that represents a pull request in the search results.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequest} props.pullRequest - The pull request to render.
 * @returns {JSX.Element} The JSX that renders this component.
 */
function PullRequest({ pullRequest }) {
  return (
    <tr>
      <td className="pr-2 py-2">
        {pullRequest.isCreatedByMetaMaskian ? (
          <MetamaskIcon className="h-[1.2em]" />
        ) : null}
      </td>
      <td className="pr-2 py-2">
        <div className="flex">
          {pullRequest.authorAvatarUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              className="rounded-full h-[1.25em] border border-white mr-[-0.5em]"
            />
          ))}
        </div>
      </td>
      <td className="pr-2 py-2 text-gray-500">
        <a
          href={pullRequest.url}
          className="hover:text-blue-500 hover:underline"
        >
          #{pullRequest.number}
        </a>
      </td>
      <td className="pr-2 py-2 font-semibold">
        <a
          href={pullRequest.url}
          className="hover:text-blue-500 hover:underline"
        >
          {pullRequest.title}
        </a>
      </td>
      <td className="pr-2 py-2 text-orange-500">
        {friendlyTime(pullRequest.createdAt)}
      </td>
      <td className="pr-2 py-2">
        {times(pullRequest.priorityLevel, (i) => (
          <DotFillIcon key={i} className="inline-block h-[1em]" />
        ))}
        {times(MAX_PRIORITY_LEVEL - pullRequest.priorityLevel, (i) => (
          <DotIcon key={i} className="inline-block h-[1em]" />
        ))}
      </td>
      <td className="pr-2 py-2">
        <div className="flex items-center">
          {pullRequest.statuses.map((status, i) => {
            return (
              <span
                key={i}
                className={classnames(
                  'inline-block rounded-full text-white py-1.5 px-2.5 text-xs',
                  {
                    'bg-black': status === 'isBlocked',
                    'bg-red-500': status !== 'isBlocked',
                    'mr-2': i < pullRequest.statuses.length - 1,
                  },
                )}
              >
                {STATUSES_BY_NAME[status]}
              </span>
            );
          })}
        </div>
      </td>
    </tr>
  );
}

PullRequest.propTypes = {
  pullRequest: PropTypes.shape({
    isCreatedByMetaMaskian: PropTypes.bool.isRequired,
    authorAvatarUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    priorityLevel: PropTypes.number.isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    url: PropTypes.string.isRequired,
  }),
};

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
            <PullRequest key={i} pullRequest={pullRequest} />
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
