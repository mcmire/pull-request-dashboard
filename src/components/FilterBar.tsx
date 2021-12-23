import React, { useState } from 'react';
import { isEqual } from 'lodash';
import {
  FILTERABLE_COLUMN_NAMES,
  FILTERS_BY_NAME,
  FILTER_NAME_VALUES,
} from '../constants';
import areFilterModifiersEqual from '../areFilterModifiersEqual';
import {
  AnyFilter,
  FilterModifiers,
  FilterSelections,
  FilterableColumnName,
  Filters,
} from '../types2';
import FilterDropdown from './FilterDropdown';
import Button from './Button';

type Props = {
  savedFilterModifiers: FilterModifiers;
  saveFilterSelections: (filters: FilterModifiers) => void;
};

/**
 * A component holding dropdowns the user can change in order to see a subset of
 * pull requests.
 *
 * @param props - The props for this component.
 * @param props.savedFilterModifiers - The current filters that are
 * being used to render the pull requests.
 * @param props.saveFilterSelections - The function that will
 * ultimately refilter the list of pull requests.
 * @returns The JSX that renders this component.
 */
export default function FilterBar({
  savedFilterModifiers,
  saveFilterSelections,
}: Props): JSX.Element {
  const [unsavedFilterModifiers, setUnsavedFilterModifiers] =
    useState<FilterModifiers>(savedFilterModifiers);
  const isButtonDisabled = areFilterModifiersEqual(
    savedFilterModifiers,
    unsavedFilterModifiers,
  );

  const updateFilterSelection = <N extends FilterableColumnName>(
    filter: Filters[N],
    filterSelection: FilterSelections[N],
  ) => {
    // TODO: Why is this not type-checking? We can put whatever we want for the
    // value here...
    setUnsavedFilterModifiers({
      ...unsavedFilterModifiers,
      [filter.name]: filterSelection.selectedValues,
    });
  };

  const selectAllFilterValues = <N extends FilterableColumnName>(
    filter: Filters[N],
  ) => {
    if (filter.name === FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES) {
      const filterSelection = {
        filterName: filter.name,
        selectedValues: filter.validOptionValues,
        allValuesSelected: true,
      };
      // TODO: Why do we have to specify the type here?
      updateFilterSelection<typeof filter.name>(filter, filterSelection);
    } else if (filter.name === FILTERABLE_COLUMN_NAMES.STATUSES) {
      const filterSelection = {
        filterName: filter.name,
        selectedValues: filter.validOptionValues,
        allValuesSelected: true,
      };
      // TODO: Why do we have to specify the type here?
      updateFilterSelection<typeof filter.name>(filter, filterSelection);
    }
  };

  const unselectAllFilterValues = (filter: AnyFilter) => {
    updateFilterSelection(filter, {
      filterName: filter.name,
      selectedValues: [],
      allValuesSelected: false,
    });
  };

  const onButtonClick = () => {
    saveFilterSelections(unsavedFilterModifiers);
  };

  return (
    <div className="flex">
      {FILTER_NAME_VALUES.map((filterName) => {
        // NOTE: This is necessary in order to tell TypeScript which code path
        // to take. Don't merge these `if` statements or else it won't work!
        if (filterName === FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES) {
          const filter = FILTERS_BY_NAME[filterName];
          const selectedValues = unsavedFilterModifiers[filterName];
          const allValuesSelected = isEqual(
            selectedValues.slice().sort(),
            filter.validOptionValues.slice().sort(),
          );
          const filterSelection = {
            filterName: filter.name,
            selectedValues,
            allValuesSelected,
          };

          return (
            <FilterDropdown
              key={filterName}
              filter={filter}
              filterSelection={filterSelection}
              updateFilterSelection={updateFilterSelection}
              selectAllFilterValues={selectAllFilterValues}
              unselectAllFilterValues={unselectAllFilterValues}
            />
          );
        } else if (filterName === FILTERABLE_COLUMN_NAMES.STATUSES) {
          const filter = FILTERS_BY_NAME[filterName];
          const selectedValues = unsavedFilterModifiers[filterName];
          const allValuesSelected = isEqual(
            selectedValues.slice().sort(),
            filter.validOptionValues.slice().sort(),
          );
          const filterSelection = {
            filterName: filter.name,
            selectedValues,
            allValuesSelected,
          };

          return (
            <FilterDropdown
              key={filterName}
              filter={filter}
              filterSelection={filterSelection}
              updateFilterSelection={updateFilterSelection}
              selectAllFilterValues={selectAllFilterValues}
              unselectAllFilterValues={unselectAllFilterValues}
            />
          );
        }

        return null;
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
