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
  NEEDS_REVIEW: 'needsReview',
  HAS_MERGE_CONFLICTS: 'hasMergeConflicts',
  HAS_REQUIRED_CHANGES: 'hasRequiredChanges',
  HAS_MISSING_TESTS: 'hasMissingTests',
  IS_BLOCKED: 'isBlocked',
  HAS_FAILING_REQUIRED_CHECKS: 'hasFailingRequiredChecks',
  IS_READY_TO_MERGE: 'isReadyToMerge',
};
export const STATUS_NAME_VALUES = [
  STATUS_NAMES.NEEDS_REVIEW,
  STATUS_NAMES.HAS_MERGE_CONFLICTS,
  STATUS_NAMES.HAS_REQUIRED_CHANGES,
  STATUS_NAMES.HAS_MISSING_TESTS,
  STATUS_NAMES.IS_BLOCKED,
  STATUS_NAMES.HAS_FAILING_REQUIRED_CHECKS,
  STATUS_NAMES.IS_READY_TO_MERGE,
];
export const STATUSES_BY_NAME = {
  [STATUS_NAMES.NEEDS_REVIEW]: 'Needs a review',
  [STATUS_NAMES.HAS_MERGE_CONFLICTS]: 'Has merge conflicts',
  [STATUS_NAMES.HAS_REQUIRED_CHANGES]: 'Has required changes',
  [STATUS_NAMES.HAS_MISSING_TESTS]: 'Missing tests',
  [STATUS_NAMES.IS_BLOCKED]: 'Blocked by dependent task',
  [STATUS_NAMES.HAS_FAILING_REQUIRED_CHECKS]: 'Has failing required checks',
  [STATUS_NAMES.IS_READY_TO_MERGE]: 'Ready to merge',
};

export const COLUMN_NAMES = {
  CREATED_AT: 'createdAt',
  PRIORITY_LEVEL: 'priorityLevel',
  STATUSES: FILTER_NAMES.STATUSES,
};
