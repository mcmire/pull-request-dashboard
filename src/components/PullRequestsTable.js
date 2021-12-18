import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import TriangleUpIcon from '../images/icons/octicons/triangle-up-16.svg';
import { COLUMN_NAMES } from '../constants';
import { PullRequestType } from './types';
import PullRequestRow from './PullRequestRow';

const initialSorting = { column: COLUMN_NAMES.CREATED_AT, reverse: false };

/**
 * A column header.
 *
 * @param {object} props - The props for this component.
 * @param {"createdAt" | "priorityLevel" | "statuses"} props.name - The short
 * name of this column.
 * @param {string} props.label - The displayable name of this column.
 * @param {boolean} props.currentSorting - Information about the current sorting
 * setting.
 * @param {Function} props.updateSortingOn - A function to re-render the table
 * sorted by this column.
 * @returns {JSX.Element} The JSX that renders this component.
 */
function ColumnHeader({ name, label, currentSorting, updateSortingOn }) {
  const isCurrentSortColumn =
    currentSorting != null && currentSorting.column === name;
  return (
    <th className="text-left text-xs font-normal text-gray-500 border-b py-1">
      {updateSortingOn != null ? (
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            updateSortingOn(name);
          }}
        >
          <span className="inline-block align-middle">{label}</span>
          {isCurrentSortColumn
            ? React.createElement(
                currentSorting.reverse ? TriangleDownIcon : TriangleUpIcon,
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

ColumnHeader.propTypes = {
  name: PropTypes.oneOf(Object.values(COLUMN_NAMES)),
  label: PropTypes.string,
  currentSorting: PropTypes.shape({
    column: PropTypes.oneOf(Object.values(COLUMN_NAMES)).isRequired,
    reverse: PropTypes.bool.isRequired,
  }),
  updateSortingOn: PropTypes.func,
};

/**
 * The component for the pull request list.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequestsRequestStatus} props.pullRequestsRequestStatus - An
 * object that contains information about the request made to fetch pull
 * requests.
 * @param {boolean} props.hasLoadedPullRequestsOnce - Whether or not the
 * first request to fetch pull requests has been made.
 * @param {Function} props.updateSorting - A function to reorder the list
 * of pull requests.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function PullRequestsTable({
  pullRequestsRequestStatus,
  hasLoadedPullRequestsOnce,
  updateSorting,
}) {
  const [sorting, setSorting] = useState(initialSorting);
  useEffect(() => {
    // TODO: Why this should wait for DashboardPage to load the pull requests?
    // Seems like that's the responsibility of DashboardPage.
    if (pullRequestsRequestStatus.type === 'loaded') {
      updateSorting(sorting);
    }
  }, [pullRequestsRequestStatus.type, updateSorting, sorting]);

  const updateSortingOn = (column) => {
    const newSorting = {
      column,
      reverse: sorting.column === column ? !sorting.reverse : false,
    };
    setSorting(newSorting);
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
          <ColumnHeader />
          <ColumnHeader />
          <ColumnHeader />
          <ColumnHeader label="Title" />
          <ColumnHeader
            label="Time"
            name={COLUMN_NAMES.CREATED_AT}
            currentSorting={sorting}
            updateSortingOn={updateSortingOn}
          />
          <ColumnHeader
            label="Priority"
            name={COLUMN_NAMES.PRIORITY_LEVEL}
            currentSorting={sorting}
            updateSortingOn={updateSortingOn}
          />
          <ColumnHeader
            label="Statuses"
            name={COLUMN_NAMES.STATUSES}
            currentSorting={sorting}
            updateSortingOn={updateSortingOn}
          />
        </tr>
      </thead>
      <tbody>{renderTbody()}</tbody>
    </table>
  );
}

PullRequestsTable.propTypes = {
  pullRequestsRequestStatus: PropTypes.shape({
    type: PropTypes.string.isRequired,
    data: PropTypes.shape({
      filteredPullRequests: PropTypes.arrayOf(PullRequestType).isRequired,
    }).isRequired,
    errorMessage: PropTypes.string,
  }),
  hasLoadedPullRequestsOnce: PropTypes.bool.isRequired,
  updateSorting: PropTypes.func.isRequired,
};
