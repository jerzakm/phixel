import { AdjustmentFilter } from 'pixi-filters'
import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'


const build = (options: any) => {
  const o = Object.create(Adjustment.defaultOptions)
  Object.assign(o, options)
  return new AdjustmentFilter(o)
}

export const Adjustment: FilterBuilder = {
  filterRef: 'adjustment',
  name: 'Color Adjustment',
  build,
  defaultOptions: {
    gamma: 1, contrast: 1, saturation: 1, brightness: 1, red: 1, green: 1, blue: 1, alpha: 1
  },
  options: [{
    name: 'Gamma',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'gamma'
  },
  {
    name: 'Contrast',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'contrast'
  },
  {
    name: 'Saturation',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'saturation'
  },
  {
    name: 'Brightness',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'brightness'
  },
  {
    name: 'Red',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'red'
  },
  {
    name: 'Green',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'green'
  },
  {
    name: 'Blue',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 0.1,
    max: 10,
    step: 0.1,
    filterProperty: 'blue'
  },
  ]
}

//         contrast?: number;
//         saturation?: number;
//         brightness?: number;
//         red?: number;
//         green?: number;
//         blue?: number;
//         alpha?: number;