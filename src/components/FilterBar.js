import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import {
  AUTHOR_FILTER_OPTION_NAMES,
  FILTER_NAMES,
  FILTER_NAME_VALUES,
  STATUS_NAMES,
} from '../constants';
import FilterDropdown from './FilterDropdown';
import Button from './Button';

const FILTERS_BY_NAME = {
  [FILTER_NAMES.AUTHOR]: {
    name: FILTER_NAMES.AUTHOR,
    validOptions: [
      { label: 'My PRs', value: AUTHOR_FILTER_OPTION_NAMES.ME },
      { label: "My Team's PRs", value: AUTHOR_FILTER_OPTION_NAMES.MY_TEAM },
      {
        label: "Contributors' PRs",
        value: AUTHOR_FILTER_OPTION_NAMES.CONTRIBUTORS,
      },
    ],
    optionLabelWhenAllOptionsSelected: 'All PRs',
    className: 'w-[175px]',
    isEachOptionExclusive: true,
  },
  [FILTER_NAMES.STATUSES]: {
    name: FILTER_NAMES.STATUSES,
    validOptions: [
      { label: 'Has merge conflicts', value: STATUS_NAMES.HAS_MERGE_CONFLICTS },
      {
        label: 'Has required changes',
        value: STATUS_NAMES.HAS_REQUIRED_CHANGES,
      },
      { label: 'Missing tests', value: STATUS_NAMES.HAS_MISSING_TESTS },
      { label: 'Blocked by dependent task', value: STATUS_NAMES.IS_BLOCKED },
      { label: 'Ready to merge', value: STATUS_NAMES.IS_READY_TO_MERGE },
    ],
    optionLabelWhenAllOptionsSelected: 'Any status',
    className: 'w-[250px]',
    isEachOptionExclusive: false,
  },
};

const initialSelectedFilters = {
  [FILTER_NAMES.AUTHOR]: AUTHOR_FILTER_OPTION_NAMES.MY_TEAM,
  [FILTER_NAMES.STATUSES]: [
    STATUS_NAMES.HAS_MERGE_CONFLICTS,
    STATUS_NAMES.HAS_REQUIRED_CHANGES,
    STATUS_NAMES.HAS_MISSING_TESTS,
    STATUS_NAMES.IS_BLOCKED,
    STATUS_NAMES.IS_READY_TO_MERGE,
  ],
};

/**
 * A component holding dropdowns the user can change in order to see a subset of
 * pull requests.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequestsRequestStatus} props.pullRequestsRequestStatus - An
 * object that contains information about the request made to fetch pull
 * requests.
 * @param {boolean} props.hasLoadedPullRequestsOnce - Whether or not the
 * first request to fetch pull requests has been made.
 * @param {Function} props.updateFilters - A function to refresh the list
 * of pull requests based on updates to filters.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterBar({
  pullRequestsRequestStatus,
  hasLoadedPullRequestsOnce,
  updateFilters,
}) {
  const [selectedFilters, setSelectedFilters] = useState(
    initialSelectedFilters,
  );
  const [previousSelectedFilters, setPreviousSelectedFilters] = useState(
    initialSelectedFilters,
  );
  const isButtonActive =
    hasLoadedPullRequestsOnce && pullRequestsRequestStatus.type !== 'loaded';
  const isButtonDisabled =
    isButtonActive || isEqual(selectedFilters, previousSelectedFilters);

  useEffect(() => {
    // TODO: Why this should wait for DashboardPage to load the pull requests?
    // Seems like that's the responsibility of DashboardPage.
    if (pullRequestsRequestStatus.type === 'loaded') {
      updateFilters(selectedFilters);
    }
  }, [pullRequestsRequestStatus.type, updateFilters, selectedFilters]);

  const updateFilterSelection = (filterName, selection) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: selection,
    });
  };

  return (
    <div className="flex">
      {FILTER_NAME_VALUES.map((filterName) => {
        return (
          <FilterDropdown
            key={filterName}
            filter={FILTERS_BY_NAME[filterName]}
            selection={selectedFilters[filterName]}
            updateSelection={updateFilterSelection}
          />
        );
      })}
    </div>
  );
}

FilterBar.propTypes = {
  pullRequestsRequestStatus: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }),
  hasLoadedPullRequestsOnce: PropTypes.bool.isRequired,
  updateFilters: PropTypes.func.isRequired,
};
