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
  edgeColor: [
    '#f6757a'
  ],
  intensity: 0.33333
}

const buildFs = (options) => {
  const edgeColor = hexToRGBA(options.edgeColor[0], 1)

  return `precision mediump float;

  uniform sampler2D u_image;
  uniform vec2 u_textureSize;

  varying vec2 v_texCoord;

  mat3 Gx = mat3(-1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0);

  mat3 Gy = mat3(-1.0, -2.0, -1.0,
      0.0, 0.0, 0.0,
      1.0, 2.0, 1.0);


  float applyKernel(mat3 gx, mat3 gy, sampler2D sampler, vec2 uv) {
    float final = 0.0;

    float horizontal = 0.0;
    float vertical = 0.0;

    for (int i = 0; i < 3; i++) {
      for (int j = 0; j < 3; j++) {
        vec2 d = vec2(float(i), float(j))/u_textureSize;
        float averagePixel = dot(texture2D(sampler, uv+d).xyz, vec3(${options.intensity.toFixed(4)}));

        horizontal += averagePixel * gx[i][j];
        vertical += averagePixel * gy[i][j];
      }
    }

    final = sqrt(horizontal * horizontal + vertical * vertical);
    return final;
  }

  void main() {

    vec2 uv = v_texCoord;

    vec4 color = texture2D(u_image, uv);
    float edgeIntensity = applyKernel(Gx, Gy, u_image, uv);

    vec4 edgeColor = mix(
        vec4(${edgeColor.r/255}, ${edgeColor.g/255}, ${edgeColor.b/255}, 1.0),
        color,
        1.0-edgeIntensity);

    color = mix(
        color,
        edgeColor,
        step(0.0, uv.x));

	gl_FragColor = color;

  // gl_FragColor = texture2D(u_image, v_texCoord);
  }`
}

const build = (gl, options) => {
  const o = Object.create(defaultOptions)
  Object.assign(o, options)
  const fs = buildFs(o)
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

export const SobelEdgeShader = {
  filterRef: 'sobelEdge',
  name: 'Sobel Edge Detect',
  build,
  defaultOptions,
  options: [{
    name: 'Edge Color',
    desc: '',
    type: 'colorPicker',
    qty: 1,
    color: [],
    filterProperty: 'edgeColor'
  }, {
    name: 'Intensity',
    desc: '',
    type: 'slider',
    min: 0,
    max: 2,
    step: 0.01,
    filterProperty: 'intensity'
  }]
}