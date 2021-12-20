import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import { FILTER_NAME_VALUES } from '../constants';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import CheckIcon from '../images/icons/octicons/check-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import { isDescendant } from '../util';

const FilterType = PropTypes.shape({
  name: PropTypes.oneOf(FILTER_NAME_VALUES),
  validOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  optionLabelWhenAllOptionsSelected: PropTypes.string.isRequired,
  optionLabelWhenNoOptionsSelected: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  isEachOptionExclusive: PropTypes.bool.isRequired,
});

/**
 * Builds the dropdown label for the given filter based on its currently
 * selected values.
 *
 * @param {object} filter - Existing information about the filter.
 * @param {string[]} selectedValues - The values that the user has selected for
 * the filter.
 * @param {bool} allValuesSelected - Whether all of the values are selected.
 * @returns {string} The label for the filter.
 */
function buildLabelForSelectedValues(
  filter,
  selectedValues,
  allValuesSelected,
) {
  if (allValuesSelected) {
    return filter.optionLabelWhenAllOptionsSelected;
  }

  if (selectedValues.length === 0) {
    return filter.optionLabelWhenNoOptionsSelected;
  }

  const labels = selectedValues.map((optionValue) => {
    const foundOption = filter.validOptions.find(
      (option) => option.value === optionValue,
    );
    if (foundOption == null) {
      throw new Error(`Couldn't find option by ${optionValue}`);
    }
    return foundOption.label;
  });

  if (labels.length > 2) {
    return `${labels.slice(2).join(', ')}, ...`;
  }
  return labels.join(', ');
}

/**
 * Component to render a menu for a filter dropdown.
 *
 * @param {object} props - The props for this component.
 * @param {Filter} props.filter - Information about the filter.
 * @param {boolean} props.isOpen - Whether the menu is open.
 * @param {string[]} props.selectedValues - The values that should be marked as
 * selected for this filter.
 * @param {Function} props.toggleSelectionOf - The function to call when a
 * value is toggled.
 * @param {Function} props.selectAllValues - The function to call when all
 * values are selected.
 * @param {Function} props.unselectAllValues - The function to call in order to
 * unselect all values.
 * @param {bool} props.allValuesSelected - Whether all of the values are
 * selected.
 * @returns {JSX.Element} The JSX that renders this component.
 */
function FilterDropdownMenu({
  filter,
  isOpen,
  selectedValues,
  allValuesSelected,
  toggleSelectionOf,
  selectAllValues,
  unselectAllValues,
}) {
  return (
    <div
      className={classnames(
        'absolute',
        'left-0',
        'top-[calc(100%_+_0.5em)]',
        'rounded',
        'border',
        'border-gray-300',
        'drop-shadow-md',
        'bg-white',
        'py-1',
        'flex',
        'flex-column',
        filter.className,
        { hidden: !isOpen },
      )}
    >
      <ul className="w-full">
        <li className="text-left mb-1">
          <a
            href="#"
            onClick={allValuesSelected ? unselectAllValues : selectAllValues}
            className="block px-4 py-2 hover:bg-gray-100 flex items-center"
          >
            {allValuesSelected ? 'Unselect all' : 'Select all'}
          </a>
        </li>

        <li className="h-px bg-gray-300 mb-1"></li>

        {filter.validOptions.map(({ label, value }) => {
          let selectionIndicator;
          if (selectedValues.includes(value)) {
            if (filter.isEachOptionExclusive) {
              selectionIndicator = (
                <DotFillIcon className="h-[1em] mr-2 flex-none" />
              );
            } else {
              selectionIndicator = (
                <CheckIcon className="h-[1em] mr-2 flex-none" />
              );
            }
          } else {
            selectionIndicator = <div className="w-[1em] h-[1em] mr-2 block" />;
          }

          return (
            <li key={label} className="text-left">
              <a
                href="#"
                onClick={() => toggleSelectionOf(value)}
                className="block px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                {selectionIndicator}
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

FilterDropdownMenu.propTypes = {
  filter: FilterType.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  allValuesSelected: PropTypes.bool,
  toggleSelectionOf: PropTypes.func.isRequired,
  selectAllValues: PropTypes.func.isRequired,
  unselectAllValues: PropTypes.func.isRequired,
};

/**
 * Component to render a dropdown for a filter along with its menu.
 *
 * @param {object} props - The props for this component.
 * @param {Filter} props.filter - Information about the filter.
 * @param {string | string[]} props.selection - The selected value or values for
 * the filter.
 * @param {Function} props.updateFilterSelection - The function to call when the
 * selection changes.
 * @param {Function} props.selectAllFilterValues - The function to call when all
 * values are selected.
 * @param {Function} props.unselectAllFilterValues - The function to call in order to
 * unselect all values.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterDropdown({
  filter,
  selection,
  updateFilterSelection,
  selectAllFilterValues,
  unselectAllFilterValues,
}) {
  const selectedValues =
    typeof selection === 'string' ? [selection] : selection;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  const allValuesSelected = isEqual(
    selectedValues.sort(),
    filter.validOptions.map((option) => option.value).sort(),
  );
  const labelForSelectedValues = buildLabelForSelectedValues(
    filter,
    selectedValues,
    allValuesSelected,
  );

  const closeMenu = useCallback(
    (event) => {
      if (isMenuOpen && !isDescendant(event.target, ref.current)) {
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen, ref],
  );

  const toggleSelectionOf = (value) => {
    if (filter.isEachOptionExclusive) {
      updateFilterSelection(filter, value);
    } else if (selection.includes(value)) {
      updateFilterSelection(
        filter,
        selection.filter((v) => v !== value),
      );
    } else {
      updateFilterSelection(filter, [...selection, value]);
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

  const onClick = (event) => {
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
        'border-gray-300',
        'bg-gray-50',
        'drop-shadow-sm',
        'text-sm',
        'bg-white',
        'mr-4',
        'inline-flex',
        'items-center',
        {
          'hover:bg-gray-100': !isMenuOpen,
          'bg-gray-100': isMenuOpen,
        },
      )}
      ref={ref}
      onClick={onClick}
    >
      <span className="mr-1">{labelForSelectedValues}</span>
      <TriangleDownIcon className="h-[1.1em]" />
      <FilterDropdownMenu
        filter={filter}
        isOpen={isMenuOpen}
        selectedValues={selectedValues}
        allValuesSelected={allValuesSelected}
        toggleSelectionOf={toggleSelectionOf}
        selectAllValues={selectAllValues}
        unselectAllValues={unselectAllValues}
      />
    </button>
  );
}

FilterDropdown.propTypes = {
  filter: FilterType.isRequired,
  selection: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
  updateFilterSelection: PropTypes.func.isRequired,
  selectAllFilterValues: PropTypes.func.isRequired,
  unselectAllFilterValues: PropTypes.func.isRequired,
};
