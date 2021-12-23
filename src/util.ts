/**
 * Determines whether one element is a descendant of another.
 *
 * @param firstElement - One element presumably down in the tree.
 * @param secondElement - Another element presumably higher up.
 * @returns Whether the first element is a descendant of the second one.
 */
export function isDescendant(
  firstElement: HTMLElement | undefined | null,
  secondElement: HTMLElement,
): boolean {
  if (firstElement === secondElement) {
    return true;
  }

  if (firstElement === document.documentElement) {
    return false;
  }

  return isDescendant(firstElement?.parentElement, secondElement);
}

/**
 * Detects whether dark mode is enabled in the user's operating system. Can only
 * be used in a browser/client-side context.
 *
 * @returns Whether dark mode is enabled.
 */
export function isDarkModeEnabled(): boolean {
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * `Object.keys()` always returns a `string[]` to account for runtime additions
 * to the object. This function does the same thing as `Object.keys()`, but
 * assumes that the object has not been changed at runtime and therefore has
 * exactly the keys we expect.
 *
 * @param object - An object.
 * @returns A set of keys.
 */
export function keys<R extends Record<string | number | symbol, unknown>>(
  object: R,
): (keyof R)[] {
  return Object.keys(object);
}

/**
 * Builds an object from another object. This does the same thing as
 * `Object.reduce()`, but assumes that the given object has not been changed at
 * runtime such that values could be missing.
 *
 * @param object - An object to iterate through.
 * @param fn - A function that can be used to extend the object.
 * @returns A new object.
 */
export function buildObject<
  A extends Record<string | number | symbol, unknown>,
  B extends Record<string | number | symbol, unknown> = A,
>(
  object: A,
  fn: (newObject: B, value: NonNullable<A[keyof A]>, key: keyof A) => B,
): B {
  return keys(object).reduce((newObject, name) => {
    const value = object[name] as NonNullable<A[keyof A]>;
    return fn(newObject, value, name);
  }, {} as B);
}
