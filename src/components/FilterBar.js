import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FILTER_NAMES } from '../constants';
import FilterDropdown from './FilterDropdown';
import Button from './Button';

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

const initialSelectedFilters = {
  creator: ['me'],
  status: [],
};

/**
 * A component holding dropdowns the user can change in order to see a subset of
 * PRs.
 *
 * @param {object} props - The props to this component.
 * @param {Function} props.updatePullRequests - A function to re-filter the list
 * of PRs.
 * @param {boolean} props.isUpdatingPullRequests - Whether or not an update to
 * the list of PRs is incoming.
 * @param {boolean} props.hasInitiallyLoadedPullRequests - Whether or not the
 * first request to fetch PRs has been made.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterBar({
  updatePullRequests,
  isUpdatingPullRequests,
  hasInitiallyLoadedPullRequests,
}) {
  const [selectedFilters, setSelectedFilters] = useState(
    initialSelectedFilters,
  );

  useEffect(() => {
    updatePullRequests({ filters: initialSelectedFilters });
  }, [updatePullRequests]);

  const toggleFilterOption = (filterName, optionName, optionValue) => {
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
  };

  const onButtonClick = () => {
    return updatePullRequests({ filters: selectedFilters });
  };

  return (
    <div className="flex">
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
      <Button
        className="text-sm"
        onClick={onButtonClick}
        inactiveLabel="Filter"
        activeLabel="Loading..."
        isActive={hasInitiallyLoadedPullRequests && !isUpdatingPullRequests}
      />
    </div>
  );
}

FilterBar.propTypes = {
  updatePullRequests: PropTypes.func.isRequired,
  isUpdatingPullRequests: PropTypes.bool.isRequired,
  hasInitiallyLoadedPullRequests: PropTypes.bool.isRequired,
};
