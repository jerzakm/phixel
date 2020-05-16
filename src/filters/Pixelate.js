import {
  PixelateFilter
} from 'pixi-filters'

const build = (options) => {
  const o = Object.create(Pixelate.defaultOptions)
  Object.assign(o, options)
  return new PixelateFilter(o.size)
}

export const Pixelate = {
  filterRef: 'pixelate',
  name: 'Pixelate',
  build,
  defaultOptions: {
    size: 4
  },
  options: [{
    name: 'Size',
    desc: 'Size of the pixel on the original image',
    type: 'slider',
    min: 1,
    max: 64,
    step: 1,
    filterProperty: 'size'
  }]
}