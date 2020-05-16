import {
  AdvancedBloomFilter
} from 'pixi-filters'

const build = (options) => {
  const o = Object.create(Bloom.defaultOptions)
  Object.assign(o, options)
  return new AdvancedBloomFilter(o)
}

export const Bloom = {
  filterRef: 'bloom',
  name: 'Bloom',
  build,
  defaultOptions: {
    treshold: 0.5,
    bloomScale: 1,
    brightness: 1,
    blur: 8
  },
  options: [{
      name: 'Scale',
      desc: '',
      type: 'slider',
      min: 0,
      max: 10,
      step: 0.01,
      filterProperty: 'bloomScale'
    },
    {
      name: 'Brightness',
      desc: '',
      type: 'slider',
      min: 0,
      max: 3,
      step: 0.01,
      filterProperty: 'brightness'
    },
    {
      name: 'Blur',
      desc: '',
      type: 'slider',
      min: 0,
      max: 10,
      step: 0.1,
      filterProperty: 'blur'
    },
    {
      name: 'Quality',
      desc: '',
      type: 'slider',
      min: 0,
      max: 32,
      step: 1,
      filterProperty: 'quality'
    },
    {
      name: 'PixelSize',
      desc: '',
      type: 'slider',
      min: 1,
      max: 64,
      step: 1,
      filterProperty: 'pixelSize'
    }
  ]
}