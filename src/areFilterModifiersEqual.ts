import { isEqual } from 'lodash';
import { buildObject } from './util';
import { FilterModifiers } from './types2';

/**
 * Given a set of filter modifiers with selected values, sorts all values so
 * that the set can be compared with another.
 *
 * @param filters - A set of filter modifiers.
 * @returns The normalized version of the filter modifiers.
 */
function normalizeFilters(filters: FilterModifiers) {
  return buildObject(filters, (obj, values, name) => {
    return { ...obj, [name]: values.slice().sort() };
  });
}

/**
 * Returns whether the same values are selected between the given two sets of
 * filters.
 *
 * @param filterModifiers1 - A set of filter modifiers.
 * @param filterModifiers2 - Another set of filter modifiers.
 * @returns Whether the filter modifiers are equal.
 */
export default function areFilterModifiersEqual(
  filterModifiers1: FilterModifiers,
  filterModifiers2: FilterModifiers,
): boolean {
  return isEqual(
    normalizeFilters(filterModifiers1),
    normalizeFilters(filterModifiers2),
  );
}
