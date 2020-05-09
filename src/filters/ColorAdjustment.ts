import { AdjustmentFilter } from 'pixi-filters'
import { FilterBuilder } from './_FilterInterfaces'


const build = (options: any) => {
  return new AdjustmentFilter(options)
}

export const Adjustment: FilterBuilder = {
  filterRef: 'adjustment',
  name: 'Color Adjustment',
  build
}