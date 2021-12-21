import { isEqual } from 'lodash';

/**
 * Returns whether the given sort configuration objects are the same.
 *
 * @param {object} sorts1 - A set of filters.
 * @param {object} sorts2 - Another set of filters.
 * @returns {boolean} Whether the filters are equal.
 */
export default function areSortsEqual(sorts1, sorts2) {
  return isEqual(sorts1, sorts2);
}
