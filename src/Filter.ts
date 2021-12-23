export default class Filter<N extends string, V extends string> {
  public className: string;

  public isEachOptionExclusive: boolean;

  public name: N;

  public optionLabelWhenAllOptionsSelected: string;

  public optionLabelWhenNoOptionsSelected: string;

  public validOptionValues: readonly V[];

  public optionLabelsByValue: Record<V, string>;

  constructor({
    className,
    isEachOptionExclusive,
    name,
    optionLabelWhenAllOptionsSelected,
    optionLabelWhenNoOptionsSelected,
    optionLabelsByValue,
    validOptionValues,
  }: {
    className: string;
    isEachOptionExclusive: boolean;
    name: N;
    optionLabelWhenAllOptionsSelected: string;
    optionLabelWhenNoOptionsSelected: string;
    optionLabelsByValue: Record<V, string>;
    validOptionValues: readonly V[];
  }) {
    this.className = className;
    this.isEachOptionExclusive = isEachOptionExclusive;
    this.name = name;
    this.optionLabelWhenAllOptionsSelected = optionLabelWhenAllOptionsSelected;
    this.optionLabelWhenNoOptionsSelected = optionLabelWhenNoOptionsSelected;
    this.optionLabelsByValue = optionLabelsByValue;
    this.validOptionValues = validOptionValues;
  }

  getValidOptions() {
    return this.validOptionValues.map((value) => {
      const label = this.optionLabelsByValue[value];
      return { label, value };
    });
  }

  getLabelForValue(value: V) {
    return this.optionLabelsByValue[value];
  }

  getLabelsForValues(values: readonly V[]) {
    return values.map((value) => {
      return this.optionLabelsByValue[value];
    });
  }

  buildLabelForSelection(
    selectedValues: readonly V[],
    allValuesSelected: boolean,
  ) {
    if (allValuesSelected) {
      return this.optionLabelWhenAllOptionsSelected;
    }

    if (selectedValues.length === 0) {
      return this.optionLabelWhenNoOptionsSelected;
    }

    const labels = selectedValues.map((optionValue) => {
      return this.optionLabelsByValue[optionValue];
    });

    if (labels.length > 2) {
      return `${labels.slice(2).join(', ')}, ...`;
    }
    return labels.join(', ');
  }
}
