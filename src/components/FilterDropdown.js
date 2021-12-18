import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import { FILTER_NAME_VALUES } from '../constants';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import CheckIcon from '../images/icons/octicons/check-16.svg';
import DotFillIcon from '../images/icons/octicons/dot-fill-16.svg';
import { isDescendant } from '../util';

/**
 * Builds the dropdown label for the given filter based on its currently
 * selected values.
 *
 * @param {object} filter - Existing information about the filter.
 * @param {string[]} selectedValues - The values that the user has selected for
 * the filter.
 * @returns {string} The label for the filter.
 */
function buildLabelForSelectedValues(filter, selectedValues) {
  const allValuesSelected = isEqual(
    selectedValues.sort(),
    filter.validOptions.map((option) => option.value).sort(),
  );

  if (allValuesSelected) {
    return filter.optionLabelWhenAllOptionsSelected;
  }
  const labels = selectedValues.map(
    (optionValue) =>
      filter.validOptions.find((option) => option.value === optionValue).label,
  );

  if (labels.length > 2) {
    return `${labels.slice(2).join(', ')}, ...`;
  }
  return labels.join(', ');
}

/**
 * FilterDropdown.
 *
 * @param {object} props - The props.
 * @param {object} props.filter - Existing information about the filter.
 * @param {string | string[]} props.selection - The selected value or values for
 * the filter.
 * @param {Function} props.updateSelection - The function to call when the
 * selection changes.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterDropdown({ filter, selection, updateSelection }) {
  const selectedValues =
    typeof selection === 'string' ? [selection] : selection;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  const labelForSelectedValues = buildLabelForSelectedValues(
    filter,
    selectedValues,
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
      updateSelection(filter.name, value);
    } else if (selection.includes(value)) {
      updateSelection(
        filter.name,
        selection.filter((v) => v !== value),
      );
    } else {
      updateSelection(filter.name, [...selection, value]);
    }
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
          { hidden: !isMenuOpen },
        )}
      >
        <ul className="w-full">
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
              selectionIndicator = (
                <div className="w-[1em] h-[1em] mr-2 block" />
              );
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
    </button>
  );
}

FilterDropdown.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.oneOf(FILTER_NAME_VALUES),
    validOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    optionLabelWhenAllOptionsSelected: PropTypes.string,
    className: PropTypes.string.isRequired,
    isEachOptionExclusive: PropTypes.bool.isRequired,
  }).isRequired,
  selection: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
  updateSelection: PropTypes.func.isRequired,
};
