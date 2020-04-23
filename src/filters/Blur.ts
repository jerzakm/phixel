import { FilterBuilder } from '../filterManager'
import * as PIXI from 'pixi.js'

const build = (options: any) => {
  return new PIXI.filters.BlurFilter(options.strength)
}

export const Blur: FilterBuilder = {
  filterRef: 'blur',
  name: 'Blur',
  build
}