import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import {
  AUTHOR,
  CONTRIBUTORS,
  FILTER_NAMES,
  HAS_MERGE_CONFLICTS,
  HAS_MISSING_TESTS,
  HAS_REQUIRED_CHANGES,
  IS_BLOCKED,
  IS_READY_TO_MERGE,
  ME,
  MY_TEAM,
  STATUSES,
} from '../constants';
import FilterDropdown from './FilterDropdown';
import Button from './Button';

const FILTERS_BY_NAME = {
  [AUTHOR]: {
    name: AUTHOR,
    validOptions: [
      { label: 'My PRs', value: ME },
      { label: "My Team's PRs", value: MY_TEAM },
      { label: "Contributors' PRs", value: CONTRIBUTORS },
    ],
    defaultOption: { label: 'My PRs', value: ME },
    className: 'w-[175px]',
    isEachOptionExclusive: true,
  },
  [STATUSES]: {
    name: STATUSES,
    validOptions: [
      { label: 'Has merge conflicts', value: HAS_MERGE_CONFLICTS },
      { label: 'Has required changes', value: HAS_REQUIRED_CHANGES },
      { label: 'Missing tests', value: HAS_MISSING_TESTS },
      { label: 'Blocked by dependent task', value: IS_BLOCKED },
      { label: 'Ready to merge', value: IS_READY_TO_MERGE },
    ],
    defaultOption: {
      label: 'Any status',
      value: null,
    },
    className: 'w-[250px]',
    isEachOptionExclusive: false,
  },
};

const initialSelectedFilters = {
  [AUTHOR]: ME,
  [STATUSES]: [],
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
 * @param {Function} props.updateFilters - A function to reload the list
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
  }, [updateFilters, selectedFilters, pullRequestsRequestStatus.type]);

  const updateFilterSelection = (filterName, selection) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: selection,
    });
  };

  const onButtonClick = () => {
    setPreviousSelectedFilters(selectedFilters);
    return updateFilters({ filters: selectedFilters });
  };

  return (
    <div className="flex">
      {FILTER_NAMES.map((filterName) => {
        return (
          <FilterDropdown
            key={filterName}
            filter={FILTERS_BY_NAME[filterName]}
            selection={selectedFilters[filterName]}
            updateSelection={updateFilterSelection}
          />
        );
      })}
      <Button
        className="text-sm"
        onClick={onButtonClick}
        inactiveLabel="Filter"
        activeLabel="Loading..."
        isActive={isButtonActive}
        disabled={isButtonDisabled}
      />
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
