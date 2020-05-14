import { ColorReplaceFilter } from 'pixi-filters'
import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'
import { hexTo0xColor } from '../util'

const build = (options: any) => {
  const o = Object.create(ReplaceColor.defaultOptions)
  Object.assign(o, options)

  return new ColorReplaceFilter(hexTo0xColor(o.originalColor[0]), hexTo0xColor(o.newColor[0]), o.epsilon)
}

export const ReplaceColor: FilterBuilder = {
  filterRef: 'colorReplace',
  name: 'Replace Color',
  build,
  defaultOptions: {
    originalColor: [`#FF0000`],
    newColor: [`#000000`],
    epsilon: 0.4
  },
  options: [
    {
      name: 'Sensitivity',
      desc: '',
      type: FilterOptionType.SLIDER,
      min: 0.1,
      max: 2,
      step: 0.01,
      filterProperty: 'epsilon'
    },
    {
      name: 'Original Color',
      desc: '',
      type: FilterOptionType.COLORPICKER,
      qty: 1,
      color: [],
      filterProperty: 'originalColor'
    },
  ]
}