import {
  defaultVertexShader,
  greyscale,
  pixelateFrag,
  defaultFragmentShader
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
  const positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // provide texture coordinates for the rectangle.
  const texcoordBuffer = gl.createBuffer();
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
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }


  // Create a texture and put the image in it.
  const originalImageTexture = createAndSetupTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // create 2 textures and attach them to framebuffers.
  const textures = [];
  const framebuffers = [];


  for (let i = 0; i < 2; i++) {
    const texture = createAndSetupTexture(gl);
    textures.push(texture);

    // make the texture the same size as the image
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Create a framebuffer
    const fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Attach a texture to it.
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }

  // setup GLSL program



  const cleanProgram = createProgramFromString(gl, defaultVertexShader, defaultFragmentShader)
  const pixelateProgram = createProgramFromString(gl, defaultVertexShader, pixelateFrag)
  const greyscaleProgram = createProgramFromString(gl, defaultVertexShader, greyscale)

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

  drawEffects();

  function drawEffects(name) {
    resizeCanvasToDisplaySize(gl.canvas)

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



    for (var i = 0; i < 5; i++) {
      setupShader(darkenShader)
      // Setup to draw into one of the framebuffers.
      setFramebuffer(gl, darkenShader, framebuffers[i % 2], image.width, image.height);

      draw(gl);

      // for the next draw, use the texture we just rendered to.
      gl.bindTexture(gl.TEXTURE_2D, textures[i % 2]);
      // increment count so we use the other texture next time.
    }

    setupShader(cleanShader)
    // finally draw the result to the canvas.
    gl.uniform1f(cleanShader.uniforms.flipYLocation, -1); // need to y flip for canvas

    setFramebuffer(gl, cleanShader, null, gl.canvas.width, gl.canvas.height);
    draw(gl);
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
}

function draw(gl) {
  // Draw the rectangle.
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

function setFramebuffer(gl, shader, fbo, width, height) {
  // make this the framebuffer we are rendering to.
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  // Tell the shader the resolution of the framebuffer.
  gl.uniform2f(shader.uniforms.resolutionLocation, width, height);

  // Tell webgl the viewport setting needed for framebuffer.
  gl.viewport(0, 0, width, height);
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
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

function createProgramFromString(gl, vs, fs) {
  const program = gl.createProgram()

  const v = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(v, vs);
  gl.compileShader(v);

  const f = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(f, fs);
  gl.compileShader(f);

  gl.attachShader(program, v)
  gl.attachShader(program, f)

  gl.linkProgram(program)

  return program
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  multiplier = Math.max(0, multiplier);
  var width = canvas.clientWidth * multiplier | 0;
  var height = canvas.clientHeight * multiplier | 0;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}