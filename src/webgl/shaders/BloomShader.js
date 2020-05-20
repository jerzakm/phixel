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

    const float blurSize = 1.0/512.0;
    const float intensity = 0.35;

    vec4 sum = vec4(0);
    vec2 texcoord = v_texCoord;
    int j;
    int i;

    //thank you! http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/ for the
    //blur tutorial
    // blur in y (vertical)
    // take nine samples, with the distance blurSize between them
    sum += texture2D(u_image, vec2(texcoord.x - 4.0*blurSize, texcoord.y)) * 0.05;
    sum += texture2D(u_image, vec2(texcoord.x - 3.0*blurSize, texcoord.y)) * 0.09;
    sum += texture2D(u_image, vec2(texcoord.x - 2.0*blurSize, texcoord.y)) * 0.12;
    sum += texture2D(u_image, vec2(texcoord.x - blurSize, texcoord.y)) * 0.15;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture2D(u_image, vec2(texcoord.x + blurSize, texcoord.y)) * 0.15;
    sum += texture2D(u_image, vec2(texcoord.x + 2.0*blurSize, texcoord.y)) * 0.12;
    sum += texture2D(u_image, vec2(texcoord.x + 3.0*blurSize, texcoord.y)) * 0.09;
    sum += texture2D(u_image, vec2(texcoord.x + 4.0*blurSize, texcoord.y)) * 0.05;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y - 4.0*blurSize)) * 0.05;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y - 3.0*blurSize)) * 0.09;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y - 2.0*blurSize)) * 0.12;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y - blurSize)) * 0.15;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y + blurSize)) * 0.15;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y + 2.0*blurSize)) * 0.12;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y + 3.0*blurSize)) * 0.09;
    sum += texture2D(u_image, vec2(texcoord.x, texcoord.y + 4.0*blurSize)) * 0.05;

    vec4 resColor = sum * sin(0.25) + texture2D(u_image, v_texCoord);

    gl_FragColor = resColor;
    // gl_FragColor = texture2D(u_image, v_texCoord);
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

export const BloomShader = {
  filterRef: 'bloom',
  name: 'Bloom',
  build,
  defaultOptions,
  options: []
}