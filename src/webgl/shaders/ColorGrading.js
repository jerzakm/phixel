import {
  createProgramFromString
} from '../renderUtils'
import {
  defaultVertexShader
} from './_defaultShaders'

const defaultOptions = {
  gamma: 1,
  contrast: 1,
  saturation: 1,
  brightness: 1,
  red: 1,
  green: 1,
  blue: 1,
  alpha: 1
}

const buildFs = (options) => {
  return `precision mediump float;

  uniform sampler2D u_image;
  uniform vec2 u_textureSize;

  varying vec2 v_texCoord;


void main(void)
{
    vec4 c = texture2D(u_image, v_texCoord);

    float gamma = ${options.gamma.toFixed(2)};
    float contrast = ${options.contrast.toFixed(2)};
    float saturation = ${options.saturation.toFixed(2)};
    float brightness = ${options.brightness.toFixed(2)};
    float red = ${options.red.toFixed(2)};
    float green = ${options.green.toFixed(2)};
    float blue = ${options.blue.toFixed(2)};
    float alpha = ${options.alpha.toFixed(2)};

    if (c.a > 0.0) {
        c.rgb /= c.a;

        vec3 rgb = pow(c.rgb, vec3(1. / gamma));
        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);
        rgb.r *= red;
        rgb.g *= green;
        rgb.b *= blue;
        c.rgb = rgb * brightness;

        c.rgb *= c.a;
    }

    gl_FragColor = c * alpha;
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

export const ColorGrading = {
  filterRef: 'colorGrading',
  name: 'Color Grading',
  build,
  defaultOptions,
  options: [{
      name: 'Gamma',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'gamma'
    },
    {
      name: 'Contrast',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'contrast'
    },
    {
      name: 'Saturation',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'saturation'
    },
    {
      name: 'Brightness',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'brightness'
    },
    {
      name: 'Red',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'red'
    },
    {
      name: 'Green',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'green'
    },
    {
      name: 'Blue',
      desc: '',
      type: 'slider',
      min: 0.1,
      max: 10,
      step: 0.1,
      filterProperty: 'blue'
    },
  ]
}