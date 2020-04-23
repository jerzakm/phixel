import { PixelateFilter } from 'pixi-filters'
import { FilterBuilder } from '../filterManager'

const build = (options: any) => {
  return new PixelateFilter(options.size)
}

export const Pixelate: FilterBuilder = {
  filterRef: 'pixelate',
  name: 'Pixelate',
  build
}