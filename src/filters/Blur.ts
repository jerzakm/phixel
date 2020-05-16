import * as PIXI from 'pixi.js'
import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'

const build = (options: any) => {
  const o = Object.create(Blur.defaultOptions)
  Object.assign(o, options)
  return new PIXI.filters.BlurFilter(o.strength, o.quality, o.resolution, o.kernelSize)
}

// CAUSING ISSUES?

export const Blur: FilterBuilder = {
  filterRef: 'blur',
  name: 'Blur',
  build,
  defaultOptions: {
    strength: 8, quality: 4, resolution: 1, kernelSize: 5
  },
  options: [{
    name: 'Strength',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 1,
    max: 64,
    step: 1,
    filterProperty: 'strength'
  }, {
    name: 'Quality',
    desc: '',
    type: FilterOptionType.SLIDER,
    min: 1,
    max: 16,
    step: 1,
    filterProperty: 'quality'
  }]
}