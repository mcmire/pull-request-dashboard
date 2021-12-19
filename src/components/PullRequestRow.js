import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { interpolateRgb, piecewise } from 'd3-interpolate';
import colors from 'tailwindcss/colors';
import {
  add as addDate,
  formatDistanceStrict as formatDateDistanceStrict,
} from 'date-fns';
import { format as formatDate } from 'date-fns-tz';
import { STATUS_NAMES } from '../constants';
import { TimeContext } from '../contexts/time';
import MetamaskIcon from '../images/metamask-fox.svg';
import DotIcon from '../images/icons/octicons/dot-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import { times } from '../util';
import { PullRequestType } from './types';

const MAX_PRIORITY_LEVEL = 5;
const STATUSES_BY_NAME = {
  [STATUS_NAMES.HAS_MERGE_CONFLICTS]: 'Has merge conflicts',
  [STATUS_NAMES.HAS_REQUIRED_CHANGES]: 'Has required changes',
  [STATUS_NAMES.HAS_MISSING_TESTS]: 'Missing tests',
  [STATUS_NAMES.IS_BLOCKED]: 'Blocked by dependent task',
  [STATUS_NAMES.IS_READY_TO_MERGE]: 'Ready to merge',
};

/**
 * Calculates the color for the pull request's time. This color is a gradient,
 * starting out as black and becoming redder as the time approaches a year ago.
 *
 * @param {Date} now - The current time.
 * @param {Date} createdAt - The pull request's time.
 * @returns {string} A hex color.
 */
function determineColorForCreatedAt(now, createdAt) {
  const oneYear = addDate(now, { years: 1 }).getTime() - now.getTime();
  const distanceFromNow = now.getTime() - createdAt.getTime();
  const normalizedCreatedAt =
    distanceFromNow >= oneYear ? 1 : distanceFromNow / oneYear;
  return piecewise(interpolateRgb.gamma(2.2), [
    '#000',
    colors.orange[500],
    colors.red[500],
  ])(normalizedCreatedAt);
}

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
      className={classnames(
        className,
        'pr-2 py-2 border-b group-hover:bg-gray-100',
      )}
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
  const { now } = useContext(TimeContext);
  const approximateCreatedAt = `${formatDateDistanceStrict(
    now,
    pullRequest.createdAt,
    {
      roundingMethod: 'floor',
    },
  )} ago`;
  const color = determineColorForCreatedAt(now, pullRequest.createdAt);

  return (
    <tr className="group">
      <Cell>
        {pullRequest.isCreatedByMetaMaskian ? (
          <MetamaskIcon className="h-[1.2em]" />
        ) : null}
      </Cell>
      <Cell>
        <div className="flex">
          {/* eslint-disable @next/next/no-img-element */}
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
      <Cell style={{ color }}>
        <time
          dateTime={pullRequest.createdAt.toISOString()}
          title={formatDate(pullRequest.createdAt, 'MMM d, yyyy, h:ss aa zzz')}
        >
          {approximateCreatedAt}
        </time>
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
                    'bg-red-500': status !== 'isReadyToMerge',
                    'bg-green-500': status === 'isReadyToMerge',
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
