import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import friendlyTime from 'friendly-time';
import MetamaskIcon from '../images/metamask-fox.svg';
import DotIcon from '../images/icons/octicons/dot-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import { times } from '../util';
import { PullRequestType } from './types';

const MAX_PRIORITY_LEVEL = 5;
const STATUSES_BY_NAME = {
  hasMergeConflicts: 'Has merge conflicts',
  hasRequiredChanges: 'Has required changes',
  hasMissingTests: 'Missing tests',
  isBlocked: 'Blocked by dependent task',
  isReadyToMerge: 'Ready to merge',
};

/**
 * Renders a cell.
 *
 * @param {object} props - The props for this component.
 * @param {string} props.className - CSS classes.
 * @param {JSX.Element} props.children - The children.
 * @returns {JSX.Element} The JSX that renders this component.
 */
function Cell({ className, children, ...rest }) {
  return (
    <td
      className={`${className} pr-2 py-2 border-b group-hover:bg-gray-100`}
      {...rest}
    >
      {children}
    </td>
  );
}

Cell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * The component that represents a pull request in the search results.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequest} props.pullRequest - The pull request to render.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function PullRequest({ pullRequest }) {
  return (
    <tr className="group">
      <Cell>
        {pullRequest.isCreatedByMetaMaskian ? (
          <MetamaskIcon className="h-[1.2em]" />
        ) : null}
      </Cell>
      <Cell>
        <div className="flex">
          <img
            src={pullRequest.author.avatarUrl}
            className="rounded-full w-[1.4em] border border-white mr-[-0.5em]"
            alt={pullRequest.author.login}
          />
        </div>
      </Cell>
      <Cell className="text-gray-500">
        <a
          href={pullRequest.url}
          target="_blank"
          className="hover:text-blue-500 hover:underline"
          rel="noreferrer"
        >
          #{pullRequest.number}
        </a>
      </Cell>
      <Cell className="font-semibold">
        <a
          href={pullRequest.url}
          target="_blank"
          className="hover:text-blue-500 hover:underline"
          rel="noreferrer"
        >
          {pullRequest.title}
        </a>
      </Cell>
      <Cell className="text-orange-500">
        {friendlyTime(pullRequest.createdAt)}
      </Cell>
      <Cell>
        {times(pullRequest.priorityLevel, (i) => (
          <DotFillIcon key={i} className="inline-block h-[1em]" />
        ))}
        {times(MAX_PRIORITY_LEVEL - pullRequest.priorityLevel, (i) => (
          <DotIcon key={i} className="inline-block h-[1em]" />
        ))}
      </Cell>
      <Cell>
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
      </Cell>
    </tr>
  );
}

PullRequest.propTypes = {
  pullRequest: PullRequestType,
};
