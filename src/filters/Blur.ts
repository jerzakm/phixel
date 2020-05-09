import * as PIXI from 'pixi.js'
import { FilterBuilder } from './_FilterInterfaces'

const build = (options: any) => {
  return new PIXI.filters.BlurFilter(options.strength)
}

export const Blur: FilterBuilder = {
  filterRef: 'blur',
  name: 'Blur',
  build
}