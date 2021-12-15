/**
 * Runs the function the given number of times, collecting the results.
 *
 * @param {number} n - The number of times you want to run the function.
 * @param {Function} fn - The function you want to run.
 * @returns {Array<any>} The collected results from each function call.
 */
export function times(n, fn) {
  const values = [];
  for (let i = 0; i < n; i++) {
    values.push(fn(i));
  }
  return values;
}

/**
 * Determines whether one element is a descendant of another.
 *
 * @param {Element} firstElement - One element presumably down in the tree.
 * @param {Element} secondElement - Another element presumably higher up.
 * @returns {boolean} Whether the first element is a descendant of the second
 * one.
 */
export function isDescendant(firstElement, secondElement) {
  if (firstElement === secondElement) {
    return true;
  }

  if (firstElement === document.documentElement) {
    return false;
  }

  return isDescendant(firstElement.parentElement, secondElement);
}
