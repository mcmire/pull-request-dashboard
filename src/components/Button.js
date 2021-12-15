import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * An abstract button component.
 *
 * @param {object} props - The props to this component.
 * @param {JSX.Element} props.inactiveLabel - The content of the button as long
 * as the button has not been clicked.
 * @param {JSX.Element} props.activeLabel - The content of the button after the
 * button is clicked and while onClick() is taking place.
 * @param {Function} props.onClick - The function to call when the button is
 * clicked.
 * @param {string} [props.className] - The CSS classes to apply to the button.
 * @returns {JSX.Element} The JSX used to render this component.
 */
export default function Button({
  inactiveLabel,
  activeLabel,
  onClick: givenOnClick,
  className = '',
}) {
  const isStillMounted = useRef(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    return () => {
      isStillMounted.current = false;
    };
  }, []);

  const onClick = useCallback(
    async (event) => {
      event.preventDefault();
      setIsActive(true);
      let result;
      try {
        result = await givenOnClick();
      } finally {
        if (isStillMounted.current && (result == null || !result.isActive)) {
          setIsActive(false);
        }
      }
    },
    [setIsActive, givenOnClick],
  );

  return (
    <button
      className={classnames(
        'rounded-lg',
        'py-1.5',
        'px-3.5',
        'text-white',
        'drop-shadow-sm',
        className,
        {
          'bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed':
            isActive,
          'bg-blue-500 hover:bg-blue-600 active:drop-shadow-none active:shadow-inner-darker active:bg-blue-700':
            !isActive,
        },
      )}
      onClick={onClick}
      disabled={isActive}
    >
      {isActive ? activeLabel : inactiveLabel}
    </button>
  );
}

Button.propTypes = {
  inactiveLabel: PropTypes.node.isRequired,
  activeLabel: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};
