import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FILTER_NAMES } from '../constants';
import TriangleDownIcon from '../images/icons/octicons/triangle-down-16.svg';
import { isDescendant } from '../util';

/**
 * FilterDropdown.
 *
 * @param {*} props - The props.
 * @param {*} props.filterName - The filterName.
 * @param {*} props.selectedOptions - The selectedOptions.
 * @param {*} props.filter - The filter.
 * @param {*} props.toggleFilterOption - The toggleFilterOption.
 * @returns {JSX.Element} The JSX that renders this component.
 */
export default function FilterDropdown({
  filterName,
  selectedOptions,
  filter,
  toggleFilterOption,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  const closeMenu = useCallback(
    (event) => {
      if (isMenuOpen && !isDescendant(event.target, ref.current)) {
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen, ref],
  );

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
      <span className="mr-1">
        {selectedOptions.length > 0
          ? selectedOptions
              .map(
                (optionValue) =>
                  filter.validOptions.find(
                    (option) => option.value === optionValue,
                  ).label,
              )
              .join(', ')
          : filter.defaultOption.label}
      </span>
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
            return (
              <li key={label} className="text-left">
                <a
                  href="#"
                  onClick={() => {
                    toggleFilterOption(filterName, label, value);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {label}
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
  filterName: PropTypes.oneOf(FILTER_NAMES),
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  filter: PropTypes.shape({
    validOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    defaultOption: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
    }).isRequired,
    className: PropTypes.string.isRequired,
  }).isRequired,
  toggleFilterOption: PropTypes.func.isRequired,
};
