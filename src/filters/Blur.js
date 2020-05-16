import * as PIXI from 'pixi.js'

const build = (options) => {
  const o = Object.create(Blur.defaultOptions)
  Object.assign(o, options)
  return new PIXI.filters.BlurFilter(o.strength, o.quality, o.resolution, o.kernelSize)
}

// CAUSING ISSUES?

export const Blur = {
  filterRef: 'blur',
  name: 'Blur',
  build,
  defaultOptions: {
    strength: 8,
    quality: 4,
    resolution: 1,
    kernelSize: 5
  },
  options: [{
    name: 'Strength',
    desc: '',
    type: 'slider',
    min: 1,
    max: 64,
    step: 1,
    filterProperty: 'strength'
  }, {
    name: 'Quality',
    desc: '',
    type: 'slider',
    min: 1,
    max: 16,
    step: 1,
    filterProperty: 'quality'
  }]
}