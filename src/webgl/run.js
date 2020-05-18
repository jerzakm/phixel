import * as twgl from 'twgl.js';
import {
  defaultVertexShader,
  greyscale,
  pixelateFrag
} from './shaders';

export const runWebGLDemo = async () => {
  main();
};

function main() {
  var image = new Image();
  const imgPath = 'test_ct.jpg'
  requestCORSIfNotSameOrigin(image, imgPath)
  image.src = imgPath;
  image.onload = function () {
    render(image);
  };
}

function render(image) {
  const canvas = document.createElement("canvas");
  canvas.id = "twgl-canvas";
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }


  // Create a buffer to put three 2d clip space points in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // provide texture coordinates for the rectangle.
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);

  function createAndSetupTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }


  // Create a texture and put the image in it.
  var originalImageTexture = createAndSetupTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // create 2 textures and attach them to framebuffers.
  var textures = [];
  var framebuffers = [];


  for (var ii = 0; ii < 2; ++ii) {
    var texture = createAndSetupTexture(gl);
    textures.push(texture);

    // make the texture the same size as the image
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Create a framebuffer
    var fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Attach a texture to it.
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }

  // setup GLSL program
  const cleanProgram = twgl.createProgram(gl, [defaultVertexShader, pixelateFrag])
  const greyscaleProgram = twgl.createProgram(gl, [defaultVertexShader, greyscale])

  const cleanShader = {
    program: cleanProgram,
    uniforms: {
      positionLocation: gl.getAttribLocation(cleanProgram, "a_position"),
      texcoordLocation: gl.getAttribLocation(cleanProgram, "a_texCoord"),
      resolutionLocation: gl.getUniformLocation(cleanProgram, "u_resolution"),
      textureSizeLocation: gl.getUniformLocation(cleanProgram, "u_textureSize"),
      flipYLocation: gl.getUniformLocation(cleanProgram, "u_flipY")
    }
  }

  const darkenShader = {
    program: greyscaleProgram,
    uniforms: {
      positionLocation: gl.getAttribLocation(greyscaleProgram, "a_position"),
      texcoordLocation: gl.getAttribLocation(greyscaleProgram, "a_texCoord"),
      resolutionLocation: gl.getUniformLocation(greyscaleProgram, "u_resolution"),
      textureSizeLocation: gl.getUniformLocation(greyscaleProgram, "u_textureSize"),
      flipYLocation: gl.getUniformLocation(greyscaleProgram, "u_flipY")
    }
  }


  // Define several convolution kernels

  drawEffects();

  function drawEffects(name) {
    twgl.resizeCanvasToDisplaySize(gl.canvas)

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 2; // 2 components per iteration
    let type = gl.FLOAT; // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; // start at the beginning of the buffer

    gl.vertexAttribPointer(
      cleanShader.uniforms.positionLocation, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(cleanShader.uniforms.texcoordLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);



    for (var ii = 0; ii < 5; ++ii) {
      setupShader(darkenShader)
      // Setup to draw into one of the framebuffers.
      setFramebuffer(framebuffers[ii % 2], image.width, image.height, darkenShader);

      draw();

      // for the next draw, use the texture we just rendered to.
      gl.bindTexture(gl.TEXTURE_2D, textures[ii % 2]);

      // increment count so we use the other texture next time.
    }


    setupShader(cleanShader)
    // finally draw the result to the canvas.
    gl.uniform1f(cleanShader.uniforms.flipYLocation, -1); // need to y flip for canvas


    setFramebuffer(null, gl.canvas.width, gl.canvas.height, cleanShader);
    draw();
  }

  function setupShader(shader) {
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    // Tell it to use our program (pair of shaders)
    gl.useProgram(shader.program);
    // set the size of the image
    gl.uniform2f(shader.uniforms.textureSizeLocation, image.width, image.height);
    gl.vertexAttribPointer(
      shader.uniforms.texcoordLocation, size, type, normalize, stride, offset);
    gl.uniform1f(shader.uniforms.flipYLocation, 1);
    // Turn on the position attribute
    gl.enableVertexAttribArray(shader.uniforms.positionLocation);
  }

  function draw() {
    // Draw the rectangle.
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }

  function setFramebuffer(fbo, width, height, shader) {
    // make this the framebuffer we are rendering to.
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Tell the shader the resolution of the framebuffer.
    gl.uniform2f(shader.uniforms.resolutionLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, width, height);
  }
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);

}

function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}