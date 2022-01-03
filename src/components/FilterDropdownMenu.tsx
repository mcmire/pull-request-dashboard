import React from 'react';
import classnames from 'classnames';
import CheckIcon from '../images/icons/octicons/check-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import {
  FilterSelections,
  FilterableColumnName,
  Filters,
  FilterSelectableValueTogglings,
} from '../types';
import { FILTERABLE_COLUMN_NAMES } from '../constants';

type Props<N extends FilterableColumnName> = {
  filter: Filters[N];
  filterSelection: FilterSelections[N];
  isOpen: boolean;
  toggleSelection: (toggling: FilterSelectableValueTogglings[N]) => void;
  selectAllValues: () => void;
  unselectAllValues: () => void;
};

/**
 * Component to render a menu for a filter dropdown.
 *
 * @param props - The props for this component.
 * @param props.filter - Information about the filter.
 * @param props.filterSelection - Information about the selected values for this
 * filter.
 * @param props.isOpen - Whether the menu is open.
 * @param props.toggleSelection - The function to call when an option is
 * selected or unselected.
 * @param props.selectAllValues - The function to call when all values are
 * selected.
 * @param props.unselectAllValues - The function to call in order to unselect
 * all values.
 * @returns The JSX that renders this component.
 */
export default function FilterDropdownMenu<N extends FilterableColumnName>({
  filter,
  filterSelection,
  isOpen,
  toggleSelection,
  selectAllValues,
  unselectAllValues,
}: Props<N>): JSX.Element {
  const onClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const renderSelectionIndicator = (
    isSelected: boolean,
    isExclusive: boolean,
  ) => {
    if (isSelected) {
      if (isExclusive) {
        return <DotFillIcon className="w-[1em] h-[1em] mr-2 flex-none" />;
      }
      return <CheckIcon className="w-[1em] h-[1em] mr-2 flex-none" />;
    }
    return <div className="w-[1em] h-[1em] mr-2 flex-none" />;
  };

  const renderItem = ({
    label,
    onClickOption,
    selectionIndicator,
  }: {
    label: string;
    onClickOption: () => void;
    selectionIndicator: JSX.Element;
  }) => {
    return (
      <li key={label} className="text-left">
        <a
          href="#"
          onClick={onClickOption}
          className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-500 flex items-baseline"
        >
          {selectionIndicator}
          <span>{label}</span>
        </a>
      </li>
    );
  };

  const renderItems = () => {
    if (
      filter.name === FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES &&
      filterSelection.filterName === FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES
    ) {
      // TODO: This seems unnecessary
      const toggleSelection2 = toggleSelection as (
        toggling: FilterSelectableValueTogglings['authorCategories'],
      ) => void;
      return filter.validOptionValues.map((value) => {
        const label = filter.optionLabelsByValue[value];
        const selectionIndicator = renderSelectionIndicator(
          filterSelection.selectedValues.includes(value),
          filter.isEachOptionExclusive,
        );
        const onClickOption = () => {
          const toggling = { filterName: filter.name, value };
          toggleSelection2(toggling);
        };

        return renderItem({ label, onClickOption, selectionIndicator });
      });
    } else if (
      filter.name === FILTERABLE_COLUMN_NAMES.STATUSES &&
      filterSelection.filterName === FILTERABLE_COLUMN_NAMES.STATUSES
    ) {
      // TODO: This seems unnecessary
      const toggleSelection2 = toggleSelection as (
        toggling: FilterSelectableValueTogglings['statuses'],
      ) => void;
      return filter.validOptionValues.map((value) => {
        const label = filter.optionLabelsByValue[value];
        const selectionIndicator = renderSelectionIndicator(
          filterSelection.selectedValues.includes(value),
          filter.isEachOptionExclusive,
        );
        const onClickOption = () => {
          const toggling = { filterName: filter.name, value };
          toggleSelection2(toggling);
        };

        return renderItem({ label, onClickOption, selectionIndicator });
      });
    }
    return null;
  };

  return (
    <div
      className={classnames(
        'absolute',
        'left-0',
        'top-[calc(100%_+_0.5em)]',
        'rounded',
        'border',
        'border-neutral-300',
        'dark:border-neutral-500',
        'drop-shadow-md',
        'bg-white',
        'dark:bg-neutral-600',
        'py-1',
        'flex',
        'flex-column',
        filter.className,
        { hidden: !isOpen },
      )}
      onClick={onClick}
    >
      <ul className="w-full">
        <li className="text-left mb-1">
          <a
            href="#"
            onClick={
              filterSelection.allValuesSelected
                ? unselectAllValues
                : selectAllValues
            }
            className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-500 flex items-baseline"
          >
            {filterSelection.allValuesSelected ? (
              <>
                <CheckIcon className="w-[1em] h-[1em] mr-2 flex-none" />{' '}
                <span>Unselect all</span>
              </>
            ) : (
              <>
                <div className="w-[1em] h-[1em] mr-2 flex-none" />
                <span>Select all</span>
              </>
            )}
          </a>
        </li>

        <li className="h-px bg-neutral-300 mb-1"></li>

        {renderItems()}
      </ul>
    </div>
  );
}
