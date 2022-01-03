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
 * Renders a cell.
 *
 * @param props - The props for this component.
 * @param props.className - CSS classes.
 * @param props.align - How to vertically-align the contents of the cell.
 * @param props.children - The children.
 * @returns The JSX that renders this component.
 */
function Cell({
  className = '',
  align = 'top',
  children,
  ...rest
}: {
  className?: string;
  align?: 'top' | 'bottom' | 'middle';
  children?: React.ReactNode;
  [prop: string]: any;
}): JSX.Element {
  return (
    <td
      className={classnames(
        `pr-2 py-2 border-b dark:border-neutral-600 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-700 align-${align}`,
        className,
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
      <Cell>
        {pullRequest.isCreatedByMetaMaskian ? (
          <MetamaskIcon className="h-[1.2em]" />
        ) : null}
      </Cell>
      <Cell align="top">
        <div className="inline-block pt-[0.28em]">
          {/* eslint-disable @next/next/no-img-element */}
          <Tippy
            content={
              <div className="text-[0.6rem]">{pullRequest.author.login}</div>
            }
          >
            <img
              src={pullRequest.author.avatarUrl}
              className="rounded-full w-[2em] border border-neutral-100 mr-[-0.5em]"
              alt={pullRequest.author.login}
            />
          </Tippy>
        </div>
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
                    'bg-black': status === STATUS_NAMES.IS_BLOCKED,
                    'bg-red-500':
                      status !== STATUS_NAMES.IS_READY_TO_MERGE &&
                      status !== STATUS_NAMES.NEEDS_REVIEW,
                    'bg-green-500': status === STATUS_NAMES.IS_READY_TO_MERGE,
                    'bg-blue-500': status === STATUS_NAMES.NEEDS_REVIEW,
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
