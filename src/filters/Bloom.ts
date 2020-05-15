import { AdvancedBloomFilter } from 'pixi-filters'
import { FilterBuilder, FilterOptionType } from './_FilterInterfaces'

const build = (options: any) => {
  const o = Object.create(Bloom.defaultOptions)
  Object.assign(o, options)
  return new AdvancedBloomFilter(o)
}

export const Bloom: FilterBuilder = {
  filterRef: 'bloom',
  name: 'Bloom',
  build,
  defaultOptions: {
    treshold: 0.5, bloomScale: 1, brightness: 1, blur: 8, quality: 4, pixelSize: 1
  },
  options: [
    {
      name: 'Scale',
      desc: '',
      type: FilterOptionType.SLIDER,
      min: 0,
      max: 10,
      step: 0.01,
      filterProperty: 'bloomScale'
    },
    {
      name: 'Brightness',
      desc: '',
      type: FilterOptionType.SLIDER,
      min: 0,
      max: 3,
      step: 0.01,
      filterProperty: 'brightness'
    },
    {
      name: 'Blur',
      desc: '',
      type: FilterOptionType.SLIDER,
      min: 0,
      max: 10,
      step: 0.1,
      filterProperty: 'blur'
    },
    {
      name: 'Quality',
      desc: '',
      type: FilterOptionType.SLIDER,
      min: 0,
      max: 32,
      step: 1,
      filterProperty: 'quality'
    },
    {
      name: 'PixelSize',
      desc: '',
      type: FilterOptionType.SLIDER,
      min: 1,
      max: 64,
      step: 1,
      filterProperty: 'pixelSize'
    }
  ]
}

// threshold: number;
//         bloomScale: number;
//         brightness: number;
//         kernels: number[];
//         blur: number;
//         quality: number;
//         pixelSize:number|PIXI.Point|number[];
//         resolution: number;