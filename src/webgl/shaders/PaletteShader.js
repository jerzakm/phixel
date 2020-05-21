import {
  createProgramFromString
} from '../renderUtils'
import {
  defaultVertexShader
} from './_defaultShaders'

import {
  hexToRGBA
} from "../../util";

const defaultOptions = {
  palette: [
    '#be4a2f', '#3e2731', '#a22633', '#e43b44', '#f77622', '#feae34', '#fee761', '#63c74d', '#3e8948', '#0099db', '#5a6988', '#3a4466', '#262b44', '#68386c', '#b55088', '#f6757a'
  ]
}

const buildFs = (palette) => {
  let parsedPalette = ``

  for (const c of palette) {
    const color = hexToRGBA(c, 1)
    parsedPalette += `TRY(${color.r / 255}, ${color.g / 255}, ${color.b / 255});\n`
  }

  return `precision mediump float;

  uniform sampler2D u_image;
  uniform vec2 u_textureSize;

  varying vec2 v_texCoord;

  float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

  float compare(vec3 a, vec3 b) {
    a*=a*a;
    b*=b*b;
    vec3 diff = (a - b);
    return dot(diff, diff);
  }

  void main() {

  const float pixelSize = 1.0;
  vec2 c = floor(v_texCoord.xy / pixelSize);
  vec2 coord = c * pixelSize;
  vec3 src = texture2D(u_image, v_texCoord).rgb;
  vec3 dst0 = vec3(0), dst1 = vec3(0);
  float best0 = 1e3, best1 = 1e3;

  #	define TRY(R, G, B) { const vec3 tst = vec3(R, G, B); float err = compare(src, tst); if (err < best0) { best1 = best0; dst1 = dst0; best0 = err; dst0 = tst; } }
  ${parsedPalette}
  #	undef TRY
  gl_FragColor = vec4(mod(c.x + c.y, 2.0) >  (hash(c * 2.0 + fract(sin(vec2(1.0, 1.7)))) * 0.75) + (best1 / (best0 + best1)) ? dst1 : dst0, 1.0);

  }`
}

const build = (gl, options) => {
  const o = Object.create(defaultOptions)
  Object.assign(o, options)
  const fs = buildFs(o.palette)
  const program = createProgramFromString(gl, defaultVertexShader, fs)
  const uniforms = {
    positionLocation: gl.getAttribLocation(program, "a_position"),
    texcoordLocation: gl.getAttribLocation(program, "a_texCoord"),
    resolutionLocation: gl.getUniformLocation(program, "u_resolution"),
    textureSizeLocation: gl.getUniformLocation(program, "u_textureSize"),
    flipYLocation: gl.getUniformLocation(program, "u_flipY")
  }
  return {
    program,
    uniforms
  }
}

export const PaletteShader = {
  filterRef: 'paletteLimiter',
  name: 'Palette Limiter',
  build,
  defaultOptions,
  options: [{
    name: 'Palette',
    desc: '',
    type: 'colorPicker',
    qty: 256,
    color: [],
    filterProperty: 'palette'
  }, ]
}