import {
  BloomShader
} from "./shaders/BloomShader";
import {
  GreyscaleShader
} from "./shaders/GreyscaleShader";
import {
  PaletteShader
} from "./shaders/PaletteShader";
import {
  PixelateShader
} from "./shaders/PixelateShader";
import {
  ColorGrading
} from "./shaders/ColorGrading";

export const shaderDictionary = [BloomShader, GreyscaleShader, PaletteShader, PixelateShader, ColorGrading]