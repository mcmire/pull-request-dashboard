import { isEqual } from 'lodash';

/**
 * Returns whether the given sort configuration objects are the same.
 *
 * @param sorts1 - A set of filters.
 * @param sorts2 - Another set of filters.
 * @returns Whether the filters are equal.
 */
export default function areSortsEqual(sorts1: any, sorts2: any): boolean {
  return isEqual(sorts1, sorts2);
}
