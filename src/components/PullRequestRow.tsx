import React from 'react';
import { times } from 'lodash';
import classnames from 'classnames';
import { interpolateRgb, piecewise } from 'd3-interpolate';
import colors from 'tailwindcss/colors';
import Tippy from '@tippyjs/react';
import {
  add as addDate,
  formatDistanceStrict as formatDateDistanceStrict,
} from 'date-fns';
import { format as formatDate } from 'date-fns-tz';
import { STATUS_NAMES, STATUSES_BY_NAME } from '../constants';
import { useNow } from '../hooks/now';
import MetamaskIcon from '../images/metamask-fox.svg';
import DotIcon from '../images/icons/octicons/dot-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import { PullRequest } from '../types';
import { isDarkModeEnabled } from '../util';

import 'tippy.js/dist/tippy.css';

const MAX_PRIORITY_LEVEL = 5;

/**
 * Calculates the color for the pull request's time. This color is a gradient,
 * starting out as black and becoming redder as the time approaches a year ago.
 *
 * @param now - The current time.
 * @param createdAt - The pull request's time.
 * @returns A hex color.
 */
function determineColorForCreatedAt(now: Date, createdAt: Date): string {
  const oneYear = addDate(now, { years: 1 }).getTime() - now.getTime();
  const distanceFromNow = now.getTime() - createdAt.getTime();
  const normalizedCreatedAt =
    distanceFromNow >= oneYear ? 1 : distanceFromNow / oneYear;
  const startingColor = isDarkModeEnabled() ? colors.neutral[400] : '#000';
  return piecewise(interpolateRgb.gamma(2.2), [
    startingColor,
    colors.orange[500],
    colors.red[500],
  ])(normalizedCreatedAt);
}

/**
 * Determines the classname that is used to decorate a pull request status.
 *
 * @param status - The status.
 * @returns The classname.
 */
function determineColorForStatus(status: string) {
  switch (status) {
    case STATUS_NAMES.IS_BLOCKED:
      return 'border-gray-400 text-gray-600 bg-gray-300';
    case STATUS_NAMES.IS_READY_TO_MERGE:
      return 'border-green-500 text-gray-100 bg-green-500';
    case STATUS_NAMES.NEEDS_REVIEW:
      return 'border-blue-300 text-blue-500 bg-blue-50';
    case STATUS_NAMES.NEEDS_DECISION:
      return 'border-violet-300 text-violet-500 bg-violet-50';
    case STATUS_NAMES.HAS_MERGE_CONFLICTS:
      return 'border-orange-300 text-orange-500 bg-orange-50';
    default:
      return 'border-red-300 text-red-500 bg-red-50';
  }
}

/**
 * Renders a cell.
 *
 * @param props - The props for this component.
 * @param props.className - CSS classes.
 * @param props.align - How to vertically-align the contents of the cell.
 * @param props.children - The children.
 * @param props.isFirst - Whether this cell is the first in its row.
 * @returns The JSX that renders this component.
 */
function Cell({
  className = '',
  align = 'top',
  isFirst = false,
  children,
  ...rest
}: {
  className?: string;
  align?: 'top' | 'bottom' | 'middle';
  isFirst?: boolean;
  children?: React.ReactNode;
  [prop: string]: any;
}): JSX.Element {
  return (
    <td
      className={classnames(
        `pr-2 py-2 border-b dark:border-neutral-600 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-700 align-${align}`,
        className,
        { 'pl-2': isFirst },
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

/**
 * The component that represents a pull request in the search results.
 *
 * @param props - The props for this component.
 * @param props.pullRequest - The pull request to render.
 * @returns The JSX that renders this component.
 */
export default function PullRequestRow({
  pullRequest,
}: {
  pullRequest: PullRequest;
}) {
  const now = useNow();
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
      return <span className="text-neutral-300">—</span>;
    }
    return times(pullRequest.priorityLevel, (i) => (
      <DotFillIcon key={i} className="inline-block h-[1em]" />
    )).concat(
      times(MAX_PRIORITY_LEVEL - pullRequest.priorityLevel, (i) => (
        <DotIcon
          key={pullRequest.priorityLevel + i}
          className="inline-block h-[1em]"
        />
      )),
    );
  };

  return (
    <tr className="group">
      <Cell className="w-[2.25em]" isFirst align="middle">
        {pullRequest.isCreatedByMetaMaskian ? (
          <MetamaskIcon className="w-full" />
        ) : null}
      </Cell>
      <Cell className="w-[2em]" align="middle">
        <Tippy
          content={<div className="text-xs">{pullRequest.author.login}</div>}
        >
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={pullRequest.author.avatarUrl}
            className="rounded-full w-full border border-neutral-300 mr-[-0.5em]"
            alt={pullRequest.author.login}
          />
        </Tippy>
      </Cell>
      <Cell className="text-neutral-500">
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
        <Tippy
          content={
            <div className="text-xs">
              {formatDate(pullRequest.createdAt, 'MMM d, yyyy, h:ss aa zzz')}
            </div>
          }
        >
          <time dateTime={pullRequest.createdAt.toISOString()}>
            {approximateCreatedAt}
          </time>
        </Tippy>
      </Cell>
      <Cell className="w-[6em]">{renderPriorityLevel()}</Cell>
      <Cell>
        <div className="flex flex-row items-center">
          {pullRequest.statuses.map((status, i) => {
            return (
              <span
                key={i}
                className={classnames(
                  'rounded-full py-1.5 px-2.5 text-xs whitespace-nowrap border',
                  determineColorForStatus(status),
                  {
                    'mr-2': i < pullRequest.statuses.length - 1,
                    'opacity-65': isDarkModeEnabled(),
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
