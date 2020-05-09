import { PixelateFilter } from 'pixi-filters'
import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'

const build = (options: any) => {
  return new PixelateFilter(options.size ? options.size : 2)
}

export const Pixelate: FilterBuilder = {
  filterRef: 'pixelate',
  name: 'Pixelate',
  build,
  options: [
    {
      type: FilterOptionType.SLIDER,
      min: 1,
      max: 64,
      step: 1,
      filterProperty: 'size'
    }
  ]
}