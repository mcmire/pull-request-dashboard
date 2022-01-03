import React, { createElement } from 'react';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import TriangleUpIcon from '../images/icons/octicons/triangle-up-16.svg';
import { SORTABLE_COLUMN_NAMES } from '../constants';
import {
  PullRequestsRequestStatus,
  SortModifiers,
  SortableColumnName,
} from '../types';
import PullRequestRow from './PullRequestRow';

type Props = {
  pullRequestsRequestStatus: PullRequestsRequestStatus;
  hasLoadedPullRequestsOnce: boolean;
  savedSortModifiers: SortModifiers;
  saveSortModifiers: (sortModifiers: SortModifiers) => void;
};

/**
 * A column header.
 *
 * @param props - The props for this component.
 * @param props.name - The short name of this column.
 * @param props.label - The displayable name of this column.
 * @param props.savedSortModifiers - Information about how the table should be
 * sorted.
 * @param props.toggleSortOn - A function to re-render the table
 * sorted by this column.
 * @returns The JSX that renders this component.
 */
function ColumnHeader<N extends SortableColumnName>({
  name,
  label,
  savedSortModifiers,
  toggleSortOn,
}: {
  name?: N;
  label?: string;
  savedSortModifiers?: SortModifiers;
  toggleSortOn?: (columnName: N) => void;
}) {
  const isCurrentSortColumn =
    savedSortModifiers != null && savedSortModifiers.column === name;
  return (
    <th className="text-left text-xs font-normal text-neutral-500 border-b dark:border-neutral-600 py-1">
      {name != null && toggleSortOn != null ? (
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            toggleSortOn(name);
          }}
        >
          <span className="inline-block align-middle">{label}</span>
          {isCurrentSortColumn
            ? createElement(
                savedSortModifiers.reverse ? TriangleDownIcon : TriangleUpIcon,
                {
                  className: 'h-[1.5em] inline-block align-middle',
                },
              )
            : null}
        </a>
      ) : (
        label
      )}
    </th>
  );
}

/**
 * The component for the pull request list.
 *
 * @param props - The props for this component.
 * @param props.pullRequestsRequestStatus - An object that contains information
 * about the request made to fetch pull requests.
 * @param props.hasLoadedPullRequestsOnce - Whether or not the first request to
 * fetch pull requests has been made.
 * @param props.savedSortModifiers - Information about how the table should be
 * sorted.
 * @param props.saveSortModifiers - A function to reorder the list of pull
 * requests.
 * @returns The JSX that renders this component.
 */
export default function PullRequestsTable({
  pullRequestsRequestStatus,
  hasLoadedPullRequestsOnce,
  savedSortModifiers,
  saveSortModifiers,
}: Props): JSX.Element {
  const toggleSortOn = (column: SortableColumnName) => {
    saveSortModifiers({
      column,
      reverse:
        savedSortModifiers.column === column
          ? !savedSortModifiers.reverse
          : false,
    });
  };

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
        <td colSpan={7} className="pt-4 pb-4 text-sm text-neutral-500 italic">
          Loading, please wait...
        </td>
      </tr>
    );
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <ColumnHeader />
          <ColumnHeader />
          <ColumnHeader />
          <ColumnHeader label="Title" />
          <ColumnHeader
            label="Time"
            name={SORTABLE_COLUMN_NAMES.CREATED_AT}
            savedSortModifiers={savedSortModifiers}
            toggleSortOn={toggleSortOn}
          />
          <ColumnHeader
            label="Priority"
            name={SORTABLE_COLUMN_NAMES.PRIORITY_LEVEL}
            savedSortModifiers={savedSortModifiers}
            toggleSortOn={toggleSortOn}
          />
          <ColumnHeader
            label="Statuses"
            name={SORTABLE_COLUMN_NAMES.STATUSES}
            savedSortModifiers={savedSortModifiers}
            toggleSortOn={toggleSortOn}
          />
        </tr>
      </thead>
      <tbody>{renderTbody()}</tbody>
    </table>
  );
}
