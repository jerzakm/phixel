import {
  Filter
} from "pixi.js";
import {
  defaultVertexShader
} from "./_shaderDefaults";
import {
  hexToRGBA
} from "../util";

const build = (options) => {
  const o = Object.create(ColorPalette.defaultOptions)
  Object.assign(o, options)
  return new PaletteLimiterBuilder(o.palette)
}

export const ColorPalette = {
  filterRef: 'paletteLimiter',
  name: 'Color Palette',
  build,
  defaultOptions: {
    palette: [
      '#be4a2f', '#3e2731', '#a22633', '#e43b44', '#f77622', '#feae34', '#fee761', '#63c74d', '#3e8948', '#0099db', '#5a6988', '#3a4466', '#262b44', '#68386c', '#b55088', '#f6757a'
    ]
  },
  options: [{
    name: 'Palette',
    desc: '',
    type: 'colorPicker',
    qty: 256,
    color: [],
    filterProperty: 'palette'
  }, ]
}

class PaletteLimiterBuilder extends Filter {
  constructor(palette) {
    super(defaultVertexShader, buildFragmentShader(palette));
  }
}

const buildFragmentShader = (palette) => {
  let parsedPalette = ``

  for (const c of palette) {
    const color = hexToRGBA(c, 1)
    parsedPalette += `TRY(${color.r / 255}, ${color.g / 255}, ${color.b / 255});\n`
  }

  return `
  precision mediump float;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
  float compare(vec3 a, vec3 b) {
    a*=a*a;
    b*=b*b;
    vec3 diff = (a - b);
    return dot(diff, diff);
  }
  void main(void)
  {
      const float pixelSize = 1.0;
      vec2 c = floor(vTextureCoord.xy / pixelSize);
      vec2 coord = c * pixelSize;
      vec3 src = texture2D(uSampler, vTextureCoord).rgb;
      vec3 dst0 = vec3(0), dst1 = vec3(0);
      float best0 = 1e3, best1 = 1e3;
      #	define TRY(R, G, B) { const vec3 tst = vec3(R, G, B); float err = compare(src, tst); if (err < best0) { best1 = best0; dst1 = dst0; best0 = err; dst0 = tst; } }
      ${parsedPalette}
      #	undef TRY
      gl_FragColor = vec4(mod(c.x + c.y, 2.0) >  (hash(c * 2.0 + fract(sin(vec2(1.0, 1.7)))) * 0.75) + (best1 / (best0 + best1)) ? dst1 : dst0, 1.0);
  }
  `
}