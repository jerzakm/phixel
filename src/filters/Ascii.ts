import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'
import { AsciiFilter } from 'pixi-filters'

const build = (options: any) => {
  const o = Object.create(Ascii.defaultOptions)
  Object.assign(o, options)
  return new AsciiFilter(o.size)
}

export const Ascii: FilterBuilder = {
  filterRef: 'ascii',
  name: 'Ascii',
  build,
  defaultOptions: {
    size: 8
  },
  options: [
    {
      name: 'Size',
      desc: 'Size of the pixel on the original image',
      type: FilterOptionType.SLIDER,
      min: 4,
      max: 64,
      step: 1,
      filterProperty: 'size'
    }
  ]
}