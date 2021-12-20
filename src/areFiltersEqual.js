import { isEqual, reduce } from 'lodash';

/**
 * Given a set of filters with selected values, sorts all values so that the set
 * can be compared with another.
 *
 * @param {object} filters - A set of filters.
 * @returns {object} The normalized version of the filters.
 */
function normalizeFilters(filters) {
  return reduce(
    filters,
    (obj, values, name) => {
      return { ...obj, [name]: values.slice().sort() };
    },
    {},
  );
}

/**
 * Returns whether the same values are selected between the given two sets of
 * filters.
 *
 * @param {object} filters1 - A set of filters.
 * @param {object} filters2 - Another set of filters.
 * @returns {boolean} Whether the filters are equal.
 */
export default function areFiltersEqual(filters1, filters2) {
  return isEqual(normalizeFilters(filters1), normalizeFilters(filters2));
}
