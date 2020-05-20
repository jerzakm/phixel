import {
  createProgramFromString
} from '../renderUtils'
import {
  defaultVertexShader
} from './_defaultShaders'

const defaultOptions = {}

const buildFs = () => {
  return `
  precision mediump float;

  // our texture
  uniform sampler2D u_image;
  uniform vec2 u_textureSize;

  // the texCoords passed in from the vertex shader.
  varying vec2 v_texCoord;


  void main() {


  vec4 color = texture2D(u_image, v_texCoord);
  float avgColor = ((color.r+color.g+color.b)/3.0);

  gl_FragColor = vec4(avgColor, avgColor, avgColor, color.a);
  }`
}

const build = (gl, options) => {
  const o = Object.create(defaultOptions)
  Object.assign(o, options)
  const fs = buildFs()
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

export const GreyscaleShader = {
  filterRef: 'greyscale',
  name: 'Greyscale',
  build,
  defaultOptions,
  options: []
}