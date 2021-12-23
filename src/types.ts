import { FILTERS_BY_NAME } from './constants';

type ValuesOf<T extends Record<string | number | symbol, unknown>> = T[keyof T];

export type Filters = typeof FILTERS_BY_NAME;
export type FilterName = keyof Filters;
export type Filter<N extends FilterName> = Filters[N];
// Ensure that if this is called with a union, the union is not distributed
// See "Distributive Conditional Types" in the Handbook
export type Filter2<N extends FilterName> = [N] extends ['authorCategories']
  ? Filters['authorCategories']
  : [N] extends ['statuses']
  ? Filters['statuses']
  : never;

//export type FilterOption<N extends FilterName> =
//Filters[N]['validOptions'][number];
export type FilterOptionValue<N extends FilterName> =
  Filters[N]['validOptionValues'][number];
export type FilterOptionValue2<N extends FilterName> =
  Filter2<N>['validOptionValues'][number];
export type FilterOptionLabel<N extends FilterName> =
  | ValuesOf<Filters[N]['optionLabelsByValue']>
  | Filters[N]['optionLabelWhenAllOptionsSelected']
  | Filters[N]['optionLabelWhenNoOptionsSelected'];
//type FilterSelections = {
//[N in keyof Filters]: Array<FilterOptionValue<N>>;
//};
export type FilterSelection<N extends FilterName> = Array<FilterOptionValue<N>>;
export type FilterSelection2<N extends FilterName> = Array<
  FilterOptionValue2<N>
>;

// This is DISTRIBUTIVE :( :(
//type X = FilterSelection2<'authorCategories'>;
//type Y = Filters[never]['optionLabelsByValue'];

//type X<N extends 'authorCategories' | 'statuses'> =
//Filters[N]['optionLabelsByValue'][Filters[N]['validOptionValues'][number]];
// The problem is that N here can be a union. When that happens,
// FilterOptionValue returns a union. That can't be plugged into
// `Filter<N>['optionLabelsByValue]` because not all filters have the same
// options.
//type Y = FilterOptionValue<'authorCategories' | 'statuses'>;
//type Z = Filters['authorCategories' | 'statuses']['optionLabelsByValue'];
