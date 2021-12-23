import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

type Props = {
  inactiveLabel: React.ReactNode;
  activeLabel: React.ReactNode;
  onClick: () => void | Promise<void> | Promise<null | { isActive: boolean }>;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
};

/**
 * An abstract button component.
 *
 * @param props - The props to this component.
 * @param props.inactiveLabel - The content of the button as long
 * as the button has not been clicked.
 * @param props.activeLabel - The content of the button after the
 * button is clicked and while onClick() is taking place.
 * @param props.onClick - The function to call when the button is
 * clicked.
 * @param props.className - The CSS classes to apply to the button.
 * @param props.disabled - Whether the button should be disabled.
 * @param props.isActive - Whether the button is in an active state.
 * @returns The JSX to render this component.
 */
export default function Button({
  inactiveLabel,
  activeLabel,
  onClick: givenOnClick,
  className = '',
  disabled: givenIsDisabled = undefined,
  isActive: givenIsActive = undefined,
}: Props): JSX.Element {
  const isStillMounted = useRef(true);
  const [isActive, setIsActive] = useState(false);
  const isDisabled = givenIsDisabled !== undefined ? givenIsDisabled : isActive;

  useEffect(() => {
    return () => {
      isStillMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (givenIsActive !== undefined) {
      setIsActive(givenIsActive);
    }
  }, [givenIsActive]);

  const onClick = useCallback(
    async (event) => {
      event.preventDefault();
      if (givenIsActive === undefined) {
        setIsActive(true);
      }
      let result;
      try {
        result = await givenOnClick();
      } finally {
        if (
          isStillMounted.current &&
          (result == null || !result.isActive) &&
          givenIsActive === undefined
        ) {
          setIsActive(false);
        }
      }
    },
    [setIsActive, givenOnClick, givenIsActive],
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
          'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-800 cursor-not-allowed':
            isDisabled,
          'bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 active:drop-shadow-none active:shadow-inner-darker active:bg-blue-700 dark:active:bg-blue-300':
            !isDisabled,
        },
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isActive ? activeLabel : inactiveLabel}
    </button>
  );
}
