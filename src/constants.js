export const FILTER_NAMES = {
  AUTHOR_CATEGORIES: 'authorCategories',
  STATUSES: 'statuses',
};
export const FILTER_NAME_VALUES = [
  FILTER_NAMES.AUTHOR_CATEGORIES,
  FILTER_NAMES.STATUSES,
];

export const AUTHOR_CATEGORY_NAMES = {
  ME: 'me',
  MY_TEAM: 'myTeam',
  CONTRIBUTORS: 'contributors',
};

export const STATUS_NAMES = {
  HAS_MERGE_CONFLICTS: 'hasMergeConflicts',
  HAS_REQUIRED_CHANGES: 'hasRequiredChanges',
  HAS_MISSING_TESTS: 'hasMissingTests',
  IS_BLOCKED: 'isBlocked',
  IS_READY_TO_MERGE: 'isReadyToMerge',
};

export const COLUMN_NAMES = {
  CREATED_AT: 'createdAt',
  PRIORITY_LEVEL: 'priorityLevel',
  STATUSES: FILTER_NAMES.STATUSES,
};
