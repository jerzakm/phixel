import {
  AdjustmentFilter
} from 'pixi-filters'


const build = (options) => {
  const o = Object.create(Adjustment.defaultOptions)
  Object.assign(o, options)
  return new AdjustmentFilter(o)
}

export const Adjustment = {
  filterRef: 'adjustment',
  name: 'Color Adjustment',
  build,
  defaultOptions: {
    gamma: 1,
    contrast: 1,
    saturation: 1,
    brightness: 1,
    red: 1,
    green: 1,
    blue: 1,
    alpha: 1
  },
  options: [{
      name: 'Gamma',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'gamma'
    },
    {
      name: 'Contrast',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'contrast'
    },
    {
      name: 'Saturation',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'saturation'
    },
    {
      name: 'Brightness',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'brightness'
    },
    {
      name: 'Red',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'red'
    },
    {
      name: 'Green',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'green'
    },
    {
      name: 'Blue',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'blue'
    },
  ]
}