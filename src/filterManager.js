import {
  ProjectFilter
} from "./project";
import {
  Filter
} from "pixi.js";
import {
  Pixelate
} from "./filters/Pixelate";
import {
  Adjustment
} from "./filters/ColorAdjustment";
import {
  ReplaceColor
} from "./filters/ReplaceColor"
import {
  Blur
} from "./filters/Blur";
import {
  Bloom
} from "./filters/Bloom";
import {
  Ascii
} from "./filters/Ascii";
import {
  ColorPalette
} from "./filters/ColorPalette";

export const filterDictionary = [Pixelate, Adjustment, Blur, Bloom, Ascii, ReplaceColor, ColorPalette]


export const refreshFilters = (filters) => {
  const finishedFilters = [];

  for (const filter of filters) {
    for (const f of filterDictionary) {
      if (filter.filterRef == f.filterRef && filter.enabled) {
        finishedFilters.push(f.build(filter.options))
      }
    }
  }

  return finishedFilters;
};