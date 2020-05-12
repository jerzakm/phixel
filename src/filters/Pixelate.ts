import { PixelateFilter } from 'pixi-filters'
import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'

const build = (options: any) => {
  const o = Object.create(Pixelate.defaultOptions)
  Object.assign(o, options)
  return new PixelateFilter(o.size)
}

export const Pixelate: FilterBuilder = {
  filterRef: 'pixelate',
  name: 'Pixelate',
  build,
  defaultOptions: {
    size: 4
  },
  options: [
    {
      name: 'Size',
      desc: 'Size of the pixel on the original image',
      type: FilterOptionType.SLIDER,
      min: 1,
      max: 64,
      step: 1,
      filterProperty: 'size'
    }
  ]
}