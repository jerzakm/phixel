import { ProjectFilter } from "./project";
import { Filter } from "pixi.js";
import * as Filters from "pixi-filters"
import { Pixelate } from "./filters/PixelateFilter";

const filterDictionary: FilterBuilder[] = [Pixelate]

export const refreshFilters = (filters: ProjectFilter[]) => {
  const finishedFilters: Filter[] = [];

  console.log(filterDictionary)

  for (const filter of filters) {
    for (const f of filterDictionary) {
      if (filter.filterRef == f.filterRef) {
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