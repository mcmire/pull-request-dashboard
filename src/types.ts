import {
  FILTERS_BY_NAME,
  FILTERABLE_COLUMN_NAMES,
  SORTABLE_COLUMN_NAMES,
} from './constants';

export type Filters = typeof FILTERS_BY_NAME;
export type FilterableColumnName = keyof Filters;
export type AnyFilter = Filters[FilterableColumnName];
export type FilterSelectableValue = {
  [N in FilterableColumnName]: Filters[N]['validOptionValues'][number];
};
export type FilterSelectableValues = {
  [N in FilterableColumnName]: readonly FilterSelectableValue[N][];
};
export type FilterOptionLabels = {
  [N in FilterableColumnName]: Filters[N]['optionLabelsByValue'];
};
export type FilterSelections = {
  [N in FilterableColumnName]: {
    filterName: N;
    selectedValues: FilterSelectableValues[N];
    allValuesSelected: boolean;
  };
};
export type AnyFilterSelection = FilterSelections[keyof FilterSelections];
export type FilterSelectableValueTogglings = {
  [N in FilterableColumnName]: {
    filterName: N;
    value: FilterSelectableValue[N];
  };
};
export type FilterSelectableValueToggling<N extends FilterableColumnName> = {
  filterName: N;
  value: FilterSelectableValue[N];
};
type AuthorCategoriesColumn = typeof FILTERABLE_COLUMN_NAMES.AUTHOR_CATEGORIES;
type StatusesColumn = typeof FILTERABLE_COLUMN_NAMES.STATUSES;

export type SortableColumnName =
  | typeof SORTABLE_COLUMN_NAMES.CREATED_AT
  | typeof SORTABLE_COLUMN_NAMES.PRIORITY_LEVEL
  | typeof SORTABLE_COLUMN_NAMES.STATUSES;

export type ColumnName = FilterableColumnName | SortableColumnName;

export type GitHubViewerResponse = {
  viewer: {
    login: string;
    organizations: {
      nodes: {
        login: string;
      }[];
    };
  };
};
export type GithubPullRequestsResponse = {
  repository: {
    pullRequests: GitHubPullRequest[];
  };
};
export type GitHubPullRequestAuthor = {
  avatarUrl: string;
  login: string;
  organizations?: {
    nodes: {
      login: string;
    }[];
  };
};
export type GitHubPullRequest = {
  author: GitHubPullRequestAuthor;
  closingIssuesReferences: {
    nodes: {
      labels: {
        nodes: {
          name: string;
        }[];
      };
    }[];
  };
  commits: {
    nodes: {
      commit: {
        message: string;
        status: {
          contexts: {
            state: string;
          }[];
        };
      };
    }[];
  };
  number: number;
  title: string;
  isDraft: boolean;
  labels: {
    nodes: {
      name: string;
    }[];
  };
  mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
  milestone: {
    title: string;
  };
  publishedAt: string;
  reviewDecision: 'CHANGES_REQUESTED' | 'APPROVED' | 'REVIEW_REQUIRED';
  url: string;
};

export type PullRequestAuthor = {
  avatarUrl: string;
  login: string;
  orgLogins: string[];
};
export type PullRequest = {
  author: PullRequestAuthor;
  // TODO: Rename this type
  authorCategories: FilterSelectableValues[AuthorCategoriesColumn];
  createdAt: Date;
  isCreatedByMetaMaskian: boolean;
  isDraft: boolean;
  labelNames: string[];
  number: number;
  priorityLevel: number;
  // TODO: Rename this type
  statuses: FilterSelectableValues[StatusesColumn];
  title: string;
  url: string;
};

export type FilterModifiers = FilterSelectableValues;
export type SortModifiers = {
  column: SortableColumnName;
  reverse: boolean;
};
export type ViewModifiers = {
  filters: FilterModifiers;
  sorts: SortModifiers;
};
export type SerializedFilterModifiers = {
  [K in keyof FilterModifiers as `filter_${K}`]: FilterModifiers[K];
};
export type SerializedSortModifiers = {
  [K in keyof SortModifiers as `sort_${K}`]: SortModifiers[K];
};
export type SerializedViewModifiers = SerializedFilterModifiers &
  SerializedSortModifiers;

export type PullRequestsRequestStatus = {
  type: 'pending' | 'loading' | 'loaded' | 'error';
  data: {
    unfilteredPullRequests: PullRequest[];
    filteredPullRequests: PullRequest[] | null;
  };
  errorMessage: string | null;
};

export type SignedInUser = {
  login: string;
  orgLogins: string[];
};
export type SignedInSession = {
  type: 'signedIn';
  apiToken: string;
  user: SignedInUser;
};
type SignedOutSession = {
  type: 'signedOut';
};
export type Session = SignedInSession | SignedOutSession;
