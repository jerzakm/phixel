import {
  createProgramFromString
} from '../renderUtils'
import {
  defaultVertexShader
} from './_defaultShaders'

const defaultOptions = {
  size: 5
}

const buildFs = (size = 5) => {
  return `precision mediump float;

  uniform sampler2D u_image;
  uniform vec2 u_textureSize;

  varying vec2 v_texCoord;

  void main() {

  float pixelWidth = ${size.toFixed(2)}/u_textureSize.x;
  float pixelHeight = ${size.toFixed(2)}/u_textureSize.y;

  float x = floor(v_texCoord.x/pixelWidth)*pixelWidth;
  float y = floor(v_texCoord.y/pixelHeight)*pixelHeight;

  gl_FragColor = texture2D(u_image, vec2(x, y));
  }`
}

const build = (gl, options) => {
  const o = Object.create(defaultOptions)
  Object.assign(o, options)
  const fs = buildFs(o.size)
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

export const PixelateShader = {
  filterRef: 'pixelate',
  name: 'Pixelate',
  build,
  defaultOptions,
  options: []
}