// TODO: Use enums for this stuff
//
export const FILTERABLE_COLUMN_NAMES = {
  AUTHOR_CATEGORIES: 'authorCategories',
  STATUSES: 'statuses',
} as const;
export const FILTER_NAME_VALUES = [
  FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES,
  FILTERABLE_COLUMN_NAMES.STATUSES,
] as const;

export const AUTHOR_CATEGORY_NAMES = {
  ME: 'me',
  MY_TEAM: 'myTeam',
  CONTRIBUTORS: 'contributors',
} as const;
export const STATUS_NAMES = {
  NEEDS_REVIEW: 'needsReview',
  HAS_MERGE_CONFLICTS: 'hasMergeConflicts',
  HAS_REQUIRED_CHANGES: 'hasRequiredChanges',
  HAS_MISSING_TESTS: 'hasMissingTests',
  HAS_FAILING_REQUIRED_CHECKS: 'hasFailingRequiredChecks',
  IS_BLOCKED: 'isBlocked',
  NEEDS_DECISION: 'needsDecision',
  IS_READY_TO_MERGE: 'isReadyToMerge',
} as const;

export const FILTERS_BY_NAME = {
  [FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES]: {
    name: FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES,
    validOptionValues: [
      AUTHOR_CATEGORY_NAMES.ME,
      AUTHOR_CATEGORY_NAMES.MY_TEAM,
      AUTHOR_CATEGORY_NAMES.CONTRIBUTORS,
    ],
    optionLabelsByValue: {
      [AUTHOR_CATEGORY_NAMES.ME]: 'My PRs',
      [AUTHOR_CATEGORY_NAMES.MY_TEAM]: "My Team's PRs",
      [AUTHOR_CATEGORY_NAMES.CONTRIBUTORS]: "Contributors' PRs",
    },
    optionLabelWhenAllOptionsSelected: 'All PRs',
    optionLabelWhenNoOptionsSelected: 'No PRs',
    className: '[width:max(175px,100%)]',
    isEachOptionExclusive: false,
  },
  [FILTERABLE_COLUMN_NAMES.STATUSES]: {
    name: FILTERABLE_COLUMN_NAMES.STATUSES,
    validOptionValues: [
      STATUS_NAMES.NEEDS_REVIEW,
      STATUS_NAMES.HAS_MERGE_CONFLICTS,
      STATUS_NAMES.HAS_REQUIRED_CHANGES,
      STATUS_NAMES.HAS_MISSING_TESTS,
      STATUS_NAMES.HAS_FAILING_REQUIRED_CHECKS,
      STATUS_NAMES.IS_BLOCKED,
      STATUS_NAMES.NEEDS_DECISION,
      STATUS_NAMES.IS_READY_TO_MERGE,
    ],
    optionLabelsByValue: {
      [STATUS_NAMES.NEEDS_REVIEW]: 'Needs a review',
      [STATUS_NAMES.HAS_MERGE_CONFLICTS]: 'Has merge conflicts',
      [STATUS_NAMES.HAS_REQUIRED_CHANGES]: 'Has required changes',
      [STATUS_NAMES.HAS_MISSING_TESTS]: 'Missing tests',
      [STATUS_NAMES.HAS_FAILING_REQUIRED_CHECKS]: 'Has failing required checks',
      [STATUS_NAMES.IS_BLOCKED]: 'Blocked',
      [STATUS_NAMES.NEEDS_DECISION]: 'Needs a decision',
      [STATUS_NAMES.IS_READY_TO_MERGE]: 'Ready to merge',
    },
    optionLabelWhenAllOptionsSelected: 'Any status',
    optionLabelWhenNoOptionsSelected: 'No status',
    className: '[width:max(250px,100%)]',
    isEachOptionExclusive: false,
  },
} as const;
export const AUTHOR_CATEGORY_NAME_VALUES =
  FILTERS_BY_NAME[FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES].validOptionValues;
export const STATUS_NAME_VALUES =
  FILTERS_BY_NAME[FILTERABLE_COLUMN_NAMES.STATUSES].validOptionValues;
export const STATUSES_BY_NAME =
  FILTERS_BY_NAME[FILTERABLE_COLUMN_NAMES.STATUSES].optionLabelsByValue;
// TODO: types should be based on this — not the other way around
export const DEFAULT_FILTERS = {
  [FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES]:
    FILTERS_BY_NAME[FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES]
      .validOptionValues,
  [FILTERABLE_COLUMN_NAMES.STATUSES]:
    FILTERS_BY_NAME[FILTERABLE_COLUMN_NAMES.STATUSES].validOptionValues,
};

export const SORTABLE_COLUMN_NAMES = {
  CREATED_AT: 'createdAt',
  PRIORITY_LEVEL: 'priorityLevel',
  STATUSES: FILTERABLE_COLUMN_NAMES.STATUSES,
} as const;
export const SORTABLE_COLUMN_NAME_VALUES = [
  SORTABLE_COLUMN_NAMES.CREATED_AT,
  SORTABLE_COLUMN_NAMES.PRIORITY_LEVEL,
  SORTABLE_COLUMN_NAMES.STATUSES,
];
export const SORT_FLAGS = {
  COLUMN: 'column',
  REVERSE: 'reverse',
} as const;
export const SORT_FLAG_VALUES = [
  SORT_FLAGS.COLUMN,
  SORT_FLAGS.REVERSE,
] as const;
// TODO: types should be based on this — not the other way around
export const DEFAULT_SORTS = {
  [SORT_FLAGS.COLUMN]: SORTABLE_COLUMN_NAMES.CREATED_AT,
  [SORT_FLAGS.REVERSE]: false,
};

export const ROUTES = {
  ROOT: '/',
  PULL_REQUESTS: '/pull_requests',
  SIGN_IN: '/sign_in',
} as const;
