export enum FilterOptionType {
  SLIDER = 'slider',
  COLORPICKER = 'colorPicker'
}

export interface Slider {
  name: string
  desc: string
  type: FilterOptionType
  min: number,
  max: number,
  step: number,
  filterProperty: string
}

export interface ColorPicker {
  name: string
  desc: string
  type: FilterOptionType
  qty: number
  color: string[]
  filterProperty: string
}

export interface FilterBuilder {
  filterRef: string
  name: string
  build: any,
  options?: (Slider | ColorPicker)[],
  defaultOptions?: any
}

export interface RgbColor {
  r: number
  g: number
  b: number
}