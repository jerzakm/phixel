import {
  createProgramFromString
} from '../renderUtils'
import {
  defaultVertexShader,
  defaultFragmentShader
} from './_defaultShaders'

const defaultOptions = {}

const build = (gl, options) => {
  const o = Object.create(defaultOptions)
  Object.assign(o, options)

  const program = createProgramFromString(gl, defaultVertexShader, defaultFragmentShader)
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

export const DefaultShader = {
  filterRef: 'basic',
  name: 'BasicShader',
  build,
  defaultOptions,
  options: []
}