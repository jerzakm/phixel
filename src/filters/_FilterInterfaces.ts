export enum FilterOptionType {
  SLIDER = 'slider'
}

export interface FilterOptionSlider {
  name: string
  desc: string
  type: FilterOptionType
  min: number,
  max: number,
  step: number,
  filterProperty: string
}

export interface FilterBuilder {
  filterRef: string
  name: string
  build: any,
  options?: (FilterOptionSlider)[],
  defaultOptions?: any
}