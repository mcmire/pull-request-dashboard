import { FilterableColumn } from './types';
import Filter from './Filter';

export default class FilterSelection<
  N extends FilterableColumn,
  V extends string,
> {
  public filter: Filter<N, V>;

  public selectedValues: readonly V[];

  public allValuesSelected: boolean;

  constructor({
    filter,
    selectedValues,
    allValuesSelected,
  }: {
    filter: Filter<N, V>;
    selectedValues: readonly V[];
    allValuesSelected: boolean;
  }) {
    this.filter = filter;
    this.selectedValues = selectedValues;
    this.allValuesSelected = allValuesSelected;
  }
}
