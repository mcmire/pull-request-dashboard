import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AUTHOR_CATEGORY_NAMES,
  FILTER_NAMES,
  FILTER_NAME_VALUES,
  STATUS_NAME_VALUES,
  STATUSES_BY_NAME,
} from '../constants';
import FilterDropdown from './FilterDropdown';

const FILTERS_BY_NAME = {
  [FILTER_NAMES.AUTHOR_CATEGORIES]: {
    name: FILTER_NAMES.AUTHOR_CATEGORIES,
    validOptions: [
      { label: 'My PRs', value: AUTHOR_CATEGORY_NAMES.ME },
      { label: "My Team's PRs", value: AUTHOR_CATEGORY_NAMES.MY_TEAM },
      {
        label: "Contributors' PRs",
        value: AUTHOR_CATEGORY_NAMES.CONTRIBUTORS,
      },
    ],
    optionLabelWhenAllOptionsSelected: 'All PRs',
    optionLabelWhenNoOptionsSelected: 'No PRs',
    className: 'w-[175px]',
    isEachOptionExclusive: false,
  },
  [FILTER_NAMES.STATUSES]: {
    name: FILTER_NAMES.STATUSES,
    validOptions: STATUS_NAME_VALUES.map((name) => ({
      label: STATUSES_BY_NAME[name],
      value: name,
    })),
    optionLabelWhenAllOptionsSelected: 'Any status',
    optionLabelWhenNoOptionsSelected: 'No status',
    className: 'w-[250px]',
    isEachOptionExclusive: false,
  },
};

const initialSelectedFilters = {
  [FILTER_NAMES.AUTHOR_CATEGORIES]: FILTERS_BY_NAME[
    FILTER_NAMES.AUTHOR_CATEGORIES
  ].validOptions.map((option) => option.value),
  [FILTER_NAMES.STATUSES]: FILTERS_BY_NAME[
    FILTER_NAMES.STATUSES
  ].validOptions.map((option) => option.value),
};

/**
 * A component holding dropdowns the user can change in order to see a subset of
 * pull requests.
 *
 * @param {object} props - The props for this component.
 * @param {PullRequestsRequestStatus} props.pullRequestsRequestStatus - An
 * object that contains information about the request made to fetch pull
 * requests.
 * @param {Function} props.updateFilters - A function to refresh the list
 * of pull requests based on updates to filters.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterBar({
  pullRequestsRequestStatus,
  updateFilters,
}) {
  const [selectedFilters, setSelectedFilters] = useState(
    initialSelectedFilters,
  );

  useEffect(() => {
    // TODO: Why this should wait for DashboardPage to load the pull requests?
    // Seems like that's the responsibility of DashboardPage.
    if (pullRequestsRequestStatus.type === 'loaded') {
      updateFilters(selectedFilters);
    }
  }, [pullRequestsRequestStatus.type, updateFilters, selectedFilters]);

  const updateFilterSelection = (filter, selection) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter.name]: selection,
    });
  };

  const selectAllFilterValues = (filter) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter.name]: filter.validOptions.map((option) => option.value),
    });
  };

  const unselectAllFilterValues = (filter) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter.name]: [],
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
            updateFilterSelection={updateFilterSelection}
            selectAllFilterValues={selectAllFilterValues}
            unselectAllFilterValues={unselectAllFilterValues}
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
  updateFilters: PropTypes.func.isRequired,
};
