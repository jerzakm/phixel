import { ProjectFilter } from "./project";
import { Filter } from "pixi.js";
import { Pixelate } from "./filters/Pixelate";
import { Adjustment } from "./filters/ColorAdjustment";
import { Blur } from "./filters/Blur";

const filterDictionary: FilterBuilder[] = [Pixelate, Adjustment, Blur]

export const refreshFilters = (filters: ProjectFilter[]) => {
  const finishedFilters: Filter[] = [];

  for (const filter of filters) {
    for (const f of filterDictionary) {
      if (filter.filterRef == f.filterRef && filter.enabled) {
        finishedFilters.push(f.build(filter.options))
      }
    }
  }

  return finishedFilters;
};

export interface FilterBuilder {
  filterRef: string
  name: string
  build: any
}