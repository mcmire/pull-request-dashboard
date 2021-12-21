import React from 'react';
import PropTypes from 'prop-types';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import TriangleUpIcon from '../images/icons/octicons/triangle-up-16.svg';
import { COLUMN_NAMES } from '../constants';
import { PullRequestType } from './types';
import PullRequestRow from './PullRequestRow';

/**
 * A column header.
 *
 * @param {object} props - The props for this component.
 * @param {"createdAt" | "priorityLevel" | "statuses"} props.name - The short
 * name of this column.
 * @param {string} props.label - The displayable name of this column.
 * @param {object} props.savedSorts - Information about how the table should be
 * sorted.
 * @param {Function} props.toggleSortOn - A function to re-render the table
 * sorted by this column.
 * @returns {JSX.Element} The JSX that renders this component.
 */
function ColumnHeader({ name, label, savedSorts, toggleSortOn }) {
  const isCurrentSortColumn = savedSorts != null && savedSorts.column === name;
  return (
    <th className="text-left text-xs font-normal text-gray-500 border-b py-1">
      {toggleSortOn != null ? (
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            toggleSortOn(name);
          }}
        >
          <span className="inline-block align-middle">{label}</span>
          {isCurrentSortColumn
            ? React.createElement(
                savedSorts.reverse ? TriangleDownIcon : TriangleUpIcon,
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
  savedSorts: PropTypes.shape({
    column: PropTypes.oneOf(Object.values(COLUMN_NAMES)).isRequired,
    reverse: PropTypes.bool.isRequired,
  }),
  toggleSortOn: PropTypes.func,
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
 * @param {object} props.savedSorts - Information about how the table should be
 * sorted.
 * @param {Function} props.saveSorts - A function to reorder the list
 * of pull requests.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function PullRequestsTable({
  pullRequestsRequestStatus,
  hasLoadedPullRequestsOnce,
  savedSorts,
  saveSorts,
}) {
  const toggleSortOn = (column) => {
    saveSorts({
      column,
      reverse: savedSorts.column === column ? !savedSorts.reverse : false,
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
            savedSorts={savedSorts}
            toggleSortOn={toggleSortOn}
          />
          <ColumnHeader
            label="Priority"
            name={COLUMN_NAMES.PRIORITY_LEVEL}
            savedSorts={savedSorts}
            toggleSortOn={toggleSortOn}
          />
          <ColumnHeader
            label="Statuses"
            name={COLUMN_NAMES.STATUSES}
            savedSorts={savedSorts}
            toggleSortOn={toggleSortOn}
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
  savedSorts: PropTypes.shape({
    column: PropTypes.oneOf(Object.values(COLUMN_NAMES)).isRequired,
    reverse: PropTypes.bool.isRequired,
  }).isRequired,
  saveSorts: PropTypes.func.isRequired,
};
