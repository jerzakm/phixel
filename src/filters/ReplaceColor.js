import {
  ColorReplaceFilter
} from 'pixi-filters'
import {
  hexTo0xColor
} from '../util'

const build = (options) => {
  const o = Object.create(ReplaceColor.defaultOptions)
  Object.assign(o, options)

  return new ColorReplaceFilter(hexTo0xColor(o.originalColor[0]), hexTo0xColor(o.newColor[0]), o.epsilon)
}

export const ReplaceColor = {
  filterRef: 'colorReplace',
  name: 'Replace Color',
  build,
  defaultOptions: {
    originalColor: [`#000000`],
    newColor: [`#FFFFFF`],
    epsilon: 0.4
  },
  options: [{
      name: 'Sensitivity',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 2,
      step: 0.01,
      filterProperty: 'epsilon'
    },
    {
      name: 'Original Color',
      desc: '',
      type: 'colorPicker',
      qty: 1,
      color: [],
      filterProperty: 'originalColor'
    },
    {
      name: 'New Color',
      desc: '',
      type: 'colorPicker',
      qty: 1,
      color: [],
      filterProperty: 'newColor'
    },
  ]
}