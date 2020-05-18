import * as twgl from 'twgl.js';
import {
  defaultVertexShader,
  equalizeFrag,
  defaultFragmentShader,
  twglDefaultVS,
  twglDefaultFs,
  twglDarkenFs,
  twglPixelateFs
} from './shaders';


export function twglTest() {
  const canvas = setupCanvas()
  const gl = twgl.getContext(canvas)

  const m4 = twgl.m4;
  const programInfoDarken = twgl.createProgramInfo(gl, [twglDefaultVS, twglDarkenFs]);
  const programInfoPixelate = twgl.createProgramInfo(gl, [twglDefaultVS, twglPixelateFs]);
  // a unit quad
  const bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

  const textures = [];
  const framebuffers = [];

  // we're only using 1 texture so just make and bind it now
  const tex = twgl.createTexture(gl, {
    src: 'test_ct.jpg',
    crossOrigin: '', // not needed if image on same origin
  }, function (err, tex, img) {
    // const t1 = twgl.createTexture(gl, {
    //   width: img.width,
    //   height: img.height
    // })
    // const t2 = twgl.createTexture(gl, {
    //   width: img.width,
    //   height: img.height
    // })
    // textures.push(t1, t2)

    // const fb1 = twgl.createFramebufferInfo(gl, undefined, img.width, img.height)
    // const fb2 = twgl.createFramebufferInfo(gl, undefined, img.width, img.height)
    // framebuffers.push(fb1, fb2)
    // wait for the image to load because we need to know it's size
    startRendering(img);
  });

  function startRendering(img) {

    requestAnimationFrame(render);

    function render(time) {
      time = 0;

      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      drawImage(
        programInfoDarken, gl.canvas.width, gl.canvas.height,
        tex, img.width, img.height,
        0, 0);
      twgl.drawBufferInfo(gl, bufferInfo);
      // requestAnimationFrame(render);
    }
  }


  // we pass in texWidth and texHeight because unlike images
  // we can't look up the width and height of a texture

  // we pass in targetWidth and targetHeight to tell it
  // the size of the thing we're drawing too. We could look
  // up the size of the canvas with gl.canvas.width and
  // gl.canvas.height but maybe we want to draw to a framebuffer
  // etc.. so might as well pass those in.

  // srcX, srcY, srcWidth, srcHeight are in pixels
  // computed from texWidth and texHeight

  // dstX, dstY, dstWidth, dstHeight are in pixels
  // computed from targetWidth and targetHeight
  function drawImage(
    programInfo, targetWidth, targetHeight,
    tex, texWidth, texHeight,
    srcX, srcY, srcWidth, srcHeight,
    dstX, dstY, dstWidth, dstHeight) {
    if (srcWidth === undefined) {
      srcWidth = texWidth;
      srcHeight = texHeight;
    }
    if (dstX === undefined) {
      dstX = srcX;
      dstY = srcY;
      srcX = 0;
      srcY = 0;
    }
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
      dstHeight = srcHeight;
    }

    var mat = m4.identity();
    var tmat = m4.identity();

    var uniforms = {
      matrix: mat,
      textureMatrix: tmat,
      texture: tex,
    };

    // these adjust the unit quad to generate texture coordinates
    // to select part of the src texture

    // NOTE: no check is done that srcX + srcWidth go outside of the
    // texture or are in range in any way. Same for srcY + srcHeight

    m4.translate(tmat, [srcX / texWidth, srcY / texHeight, 0], tmat);
    m4.scale(tmat, [srcWidth / texWidth, srcHeight / texHeight, 1], tmat);

    // these convert from pixels to clip space
    m4.ortho(0, targetWidth, targetHeight, 0, -1, 1, mat)

    // these move and scale the unit quad into the size we want
    // in the target as pixels
    m4.translate(mat, [dstX, dstY, 0], mat);
    m4.scale(mat, [dstWidth, dstHeight, 1], mat);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);



  }
}

function setupCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "twgl-canvas";
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  return canvas
}