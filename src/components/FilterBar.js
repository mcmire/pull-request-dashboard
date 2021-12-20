import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FILTER_NAME_VALUES, FILTERS_BY_NAME } from '../constants';
import areFiltersEqual from '../areFiltersEqual';
import FilterDropdown from './FilterDropdown';
import Button from './Button';

/**
 * A component holding dropdowns the user can change in order to see a subset of
 * pull requests.
 *
 * @param {object} props - The props for this component.
 * @param {object} props.savedSelectedFilters - The current filters that are
 * being used to render the pull requests.
 * @param {Function} props.saveSelectedFilters - The function that will
 * ultimately refilter the list of pull requests.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterBar({
  savedSelectedFilters,
  saveSelectedFilters,
}) {
  const [unsavedSelectedFilters, setUnsavedSelectedFilters] =
    useState(savedSelectedFilters);
  const isButtonDisabled = areFiltersEqual(
    savedSelectedFilters,
    unsavedSelectedFilters,
  );

  const updateFilterSelection = (filter, selection) => {
    setUnsavedSelectedFilters({
      ...unsavedSelectedFilters,
      [filter.name]: selection,
    });
  };

  const selectAllFilterValues = (filter) => {
    setUnsavedSelectedFilters({
      ...unsavedSelectedFilters,
      [filter.name]: filter.validOptions.map((option) => option.value),
    });
  };

  const unselectAllFilterValues = (filter) => {
    setUnsavedSelectedFilters({
      ...unsavedSelectedFilters,
      [filter.name]: [],
    });
  };

  const onButtonClick = () => {
    saveSelectedFilters(unsavedSelectedFilters);
  };

  return (
    <div className="flex">
      {FILTER_NAME_VALUES.map((filterName) => {
        return (
          <FilterDropdown
            key={filterName}
            filter={FILTERS_BY_NAME[filterName]}
            selectedValues={unsavedSelectedFilters[filterName] ?? []}
            updateFilterSelection={updateFilterSelection}
            selectAllFilterValues={selectAllFilterValues}
            unselectAllFilterValues={unselectAllFilterValues}
          />
        );
      })}
      <Button
        className="text-sm"
        onClick={onButtonClick}
        inactiveLabel="Filter"
        activeLabel="Loading..."
        disabled={isButtonDisabled}
      />
    </div>
  );
}

FilterBar.propTypes = {
  savedSelectedFilters: PropTypes.object.isRequired,
  saveSelectedFilters: PropTypes.func.isRequired,
};
