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
import { STATUSES_BY_NAME } from '../constants';
import { TimeContext } from '../contexts/time';
import MetamaskIcon from '../images/metamask-fox.svg';
import DotIcon from '../images/icons/octicons/dot-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import { times } from '../util';
import { PullRequestType } from './types';

const MAX_PRIORITY_LEVEL = 5;

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
 * @param {string} props.align - How to vertically-align the contents of the
 * cell.
 * @param {JSX.Element} props.children - The children.
 * @returns {JSX.Element} The JSX that renders this component.
 */
function Cell({ className, align = 'top', children, ...rest }) {
  return (
    <td
      className={classnames(
        `pr-2 py-2 border-b group-hover:bg-gray-100 align-${align}`,
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

Cell.propTypes = {
  className: PropTypes.string,
  align: PropTypes.string,
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

  const renderPriorityLevel = () => {
    if (pullRequest.priorityLevel === 0) {
      return '—';
    }
    return times(pullRequest.priorityLevel, (i) => (
      <DotFillIcon key={i} className="inline-block h-[1em]" />
    )).concat(
      times(MAX_PRIORITY_LEVEL - pullRequest.priorityLevel, (i) => (
        <DotIcon key={i} className="inline-block h-[1em]" />
      )),
    );
  };

  return (
    <tr className="group">
      <Cell>
        {pullRequest.isCreatedByMetaMaskian ? (
          <MetamaskIcon className="h-[1.2em]" />
        ) : null}
      </Cell>
      <Cell align="top">
        <div className="inline-block pt-[0.07em]">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={pullRequest.author.avatarUrl}
            className="rounded-full w-[2em] border border-white mr-[-0.5em]"
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
      <Cell style={{ color }} className="w-[8em]">
        <time
          dateTime={pullRequest.createdAt.toISOString()}
          title={formatDate(pullRequest.createdAt, 'MMM d, yyyy, h:ss aa zzz')}
        >
          {approximateCreatedAt}
        </time>
      </Cell>
      <Cell className="w-[6em]">{renderPriorityLevel()}</Cell>
      <Cell>
        <div className="flex flex-row items-center">
          {pullRequest.statuses.map((status, i) => {
            return (
              <span
                key={i}
                className={classnames(
                  'rounded-full text-white py-1.5 px-2.5 text-xs whitespace-nowrap',
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
