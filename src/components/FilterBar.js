import React from 'react';
import PropTypes from 'prop-types';
import { FILTER_NAMES } from '../constants';
import FilterDropdown from './FilterDropdown';

const FILTERS_BY_NAME = {
  creator: {
    validOptions: [
      { label: 'My PRs', value: 'me' },
      { label: "My Team's PRs", value: 'myTeam' },
      { label: "Contributors' PRs", value: 'contributors' },
    ],
    defaultOption: { label: 'My PRs', value: 'me' },
    className: 'w-[175px]',
  },
  status: {
    validOptions: [
      { label: 'Has merge conflicts', value: 'hasMergeConflicts' },
      { label: 'Has required changes', value: 'hasRequiredChanges' },
      { label: 'Missing tests', value: 'hasMissingTests' },
      { label: 'Blocked by dependent task', value: 'isBlocked' },
      { label: 'Ready to merge', value: 'isReadyToMerge' },
    ],
    defaultOption: {
      label: 'Any status',
      value: null,
    },
    className: 'w-[200px]',
  },
};

/**
 * A component holding dropdowns the user can change in order to see a subset of
 * PRs.
 *
 * @param {*} props - The props to this component.
 * @param {*} props.selectedFilters - The filters that the user has selected.
 * @param {*} props.setSelectedFilters - A function to re-filter the list of PRs.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterBar({ selectedFilters, setSelectedFilters }) {
  /**
   * Toggles the filter option.
   *
   * @param {*} filterName - The filterName.
   * @param {*} optionName - The optionName.
   * @param {*} optionValue - The optionValue.
   */
  function toggleFilterOption(filterName, optionName, optionValue) {
    const selectedOptions = new Set(selectedFilters[optionName]);

    if (selectedOptions.has(optionValue)) {
      selectedOptions.delete(optionValue);
    } else {
      selectedOptions.add(optionValue);
    }

    setSelectedFilters({
      ...selectedFilters,
      [filterName]: selectedOptions,
    });
  }

  return (
    <div className="mb-4">
      {FILTER_NAMES.map((filterName) => {
        return (
          <FilterDropdown
            key={filterName}
            name={filterName}
            selectedOptions={selectedFilters[filterName]}
            filter={FILTERS_BY_NAME[filterName]}
            toggleFilterOption={toggleFilterOption}
          />
        );
      })}
    </div>
  );
}

FilterBar.propTypes = {
  selectedFilters: PropTypes.shape({
    creator: PropTypes.array.isRequired,
    status: PropTypes.array.isRequired,
  }).isRequired,
  setSelectedFilters: PropTypes.func.isRequired,
};
