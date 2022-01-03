import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import {
  FilterSelectableValueTogglings,
  FilterSelections,
  FilterableColumnName,
  Filters,
} from '../types';
import { isDescendant } from '../util';
import FilterDropdownMenu from './FilterDropdownMenu';

type Props<N extends FilterableColumnName> = {
  filter: Filters[N];
  filterSelection: FilterSelections[N];
  updateFilterSelection: (
    filter: Filters[N],
    filterSelection: FilterSelections[N],
  ) => void;
  selectAllFilterValues: (filter: Filters[N]) => void;
  unselectAllFilterValues: (filter: Filters[N]) => void;
};

/**
 * Builds the dropdown label for the given filter based on its currently
 * selected values.
 *
 * @param filter - Existing information about the filter.
 * @param filterSelection - Information about the values that the user has
 * selected for the filter.
 * @returns The label for the filter.
 */
function buildLabelForSelection<N extends FilterableColumnName>(
  filter: Filters[N],
  filterSelection: FilterSelections[N],
): string {
  if (filterSelection.allValuesSelected) {
    return filter.optionLabelWhenAllOptionsSelected;
  }

  if (filterSelection.selectedValues.length === 0) {
    return filter.optionLabelWhenNoOptionsSelected;
  }

  let labels: string[] = [];
  // NOTE: This is necessary in order to tell TypeScript which code path to
  // take. Don't merge these `if` statements or else it won't work!
  if (
    filter.name === 'authorCategories' &&
    filterSelection.filterName === 'authorCategories'
  ) {
    labels = filterSelection.selectedValues.map((value) => {
      return filter.optionLabelsByValue[value];
    });
  } else if (
    filter.name === 'statuses' &&
    filterSelection.filterName === 'statuses'
  ) {
    labels = filterSelection.selectedValues.map((value) => {
      return filter.optionLabelsByValue[value];
    });
  }

  if (labels.length > 2) {
    return `${labels.slice(2).join(', ')}, ...`;
  }
  return labels.join(', ');
}

/**
 * Component to render a dropdown for a filter along with its menu.
 *
 * @param props - The props for this component.
 * @param props.filter - Information about the filter.
 * @param props.filterSelection - Information about the selected values for the
 * filter.
 * @param props.updateFilterSelection - The function to call when any
 * of the options are selected or unselected.
 * @param props.selectAllFilterValues - The function to call when all
 * values are selected.
 * @param props.unselectAllFilterValues - The function to call in order to
 * unselect all values.
 * @returns The JSX that renders this component.
 */
export default function FilterDropdown<N extends FilterableColumnName>({
  filter,
  filterSelection,
  updateFilterSelection,
  selectAllFilterValues,
  unselectAllFilterValues,
}: Props<N>) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const labelForSelectedValues = buildLabelForSelection(
    filter,
    filterSelection,
  );

  const closeMenu = useCallback(
    (event) => {
      if (
        isMenuOpen &&
        ref.current != null &&
        !isDescendant(event.target, ref.current)
      ) {
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen, ref],
  );

  const toggleSelection = (toggling: FilterSelectableValueTogglings[N]) => {
    // NOTE: This is necessary in order to tell TypeScript which code path to
    // take. Don't merge these `if` statements or else it won't work!
    if (
      filter.name === 'authorCategories' &&
      filterSelection.filterName === 'authorCategories' &&
      toggling.filterName === 'authorCategories'
    ) {
      if (filter.isEachOptionExclusive) {
        updateFilterSelection(filter, {
          ...filterSelection,
          selectedValues: [toggling.value],
        });
      } else if (filterSelection.selectedValues.includes(toggling.value)) {
        updateFilterSelection(filter, {
          ...filterSelection,
          selectedValues: filterSelection.selectedValues.filter(
            (v) => v !== toggling.value,
          ),
        });
      } else {
        updateFilterSelection(filter, {
          ...filterSelection,
          selectedValues: [...filterSelection.selectedValues, toggling.value],
        });
      }
    } else if (
      filter.name === 'statuses' &&
      filterSelection.filterName === 'statuses' &&
      toggling.filterName === 'statuses'
    ) {
      if (filter.isEachOptionExclusive) {
        updateFilterSelection(filter, {
          ...filterSelection,
          selectedValues: [toggling.value],
        });
      } else if (filterSelection.selectedValues.includes(toggling.value)) {
        updateFilterSelection(filter, {
          ...filterSelection,
          selectedValues: filterSelection.selectedValues.filter(
            (v) => v !== toggling.value,
          ),
        });
      } else {
        updateFilterSelection(filter, {
          ...filterSelection,
          selectedValues: [...filterSelection.selectedValues, toggling.value],
        });
      }
    }
  };

  const selectAllValues = () => {
    selectAllFilterValues(filter);
  };

  const unselectAllValues = () => {
    unselectAllFilterValues(filter);
  };

  useEffect(() => {
    document.body.addEventListener('click', closeMenu);

    return () => {
      document.body.removeEventListener('click', closeMenu);
    };
  }, [closeMenu]);

  const onClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <button
      className={classnames(
        'inline-block',
        'rounded-lg',
        'py-1.5',
        'px-3.5',
        'border',
        'border-neutral-300',
        'dark:border-neutral-500',
        'drop-shadow-sm',
        'dark:text-neutral-300',
        'text-sm',
        'mr-4',
        'inline-flex',
        'items-center',
        {
          'bg-neutral-50 dark:bg-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-500':
            !isMenuOpen,
          'bg-neutral-100 dark:bg-neutral-500': isMenuOpen,
        },
      )}
      ref={ref}
      onClick={onClick}
    >
      <span className="mr-1">{labelForSelectedValues}</span>
      <TriangleDownIcon className="h-[1.1em]" />
      <FilterDropdownMenu
        filter={filter}
        filterSelection={filterSelection}
        isOpen={isMenuOpen}
        toggleSelection={toggleSelection}
        selectAllValues={selectAllValues}
        unselectAllValues={unselectAllValues}
      />
    </button>
  );
}
