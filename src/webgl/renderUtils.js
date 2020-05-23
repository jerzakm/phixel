export function draw(gl) {
  // Draw the rectangle.
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

export function setFramebuffer(gl, shader, fbo, width, height) {
  // make this the framebuffer we are rendering to.
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  // Tell the shader the resolution of the framebuffer.
  gl.uniform2f(shader.uniforms.resolutionLocation, width, height);

  // Tell webgl the viewport setting needed for framebuffer.
  gl.viewport(0, 0, width, height);
}

export function setRectangle(gl, x, y, width, height) {
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

export function createProgramFromString(gl, vs, fs) {
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

export function resizeCanvasToDisplaySize(canvas, multiplier = 1) {
  multiplier = Math.max(0, multiplier);
  let width = window.innerWidth * multiplier | 0;
  let height = window.innerHeight * multiplier | 0;

  canvas.width = width;
  canvas.height = height;
}

export function createAndSetupTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}

export function setupShader(gl, image, shader) {
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  // Tell it to use our program (pair of shaders)
  gl.useProgram(shader.program);
  // set the size of the image
  gl.uniform2f(
    shader.uniforms.textureSizeLocation,
    image.width,
    image.height
  );
  gl.vertexAttribPointer(
    shader.uniforms.texcoordLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  gl.uniform1f(shader.uniforms.flipYLocation, 1);
  // Turn on the position attribute
  gl.enableVertexAttribArray(shader.uniforms.positionLocation);
}

export function stateReset(gl) {
  var numAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
  var tmp = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, tmp)
  for (var ii = 0; ii < numAttribs; ++ii) {
    gl.disableVertexAttribArray(ii)
    gl.vertexAttribPointer(ii, 4, gl.FLOAT, false, 0, 0)
    gl.vertexAttrib1f(ii, 0)
  }
  gl.deleteBuffer(tmp)

  var numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
  for (var ii = 0; ii < numTextureUnits; ++ii) {
    gl.activeTexture(gl.TEXTURE0 + ii)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  gl.activeTexture(gl.TEXTURE0)
  gl.useProgram(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindRenderbuffer(gl.RENDERBUFFER, null)
  gl.disable(gl.BLEND)
  gl.disable(gl.CULL_FACE)
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.DITHER)
  gl.disable(gl.SCISSOR_TEST)
  gl.blendColor(0, 0, 0, 0)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(gl.ONE, gl.ZERO)
  gl.clearColor(0, 0, 0, 0)
  gl.clearDepth(1)
  gl.clearStencil(-1)
  gl.colorMask(true, true, true, true)
  gl.cullFace(gl.BACK)
  gl.depthFunc(gl.LESS)
  gl.depthMask(true)
  gl.depthRange(0, 1)
  gl.frontFace(gl.CCW)
  gl.hint(gl.GENERATE_MIPMAP_HINT, gl.DONT_CARE)
  gl.lineWidth(1)
  gl.pixelStorei(gl.PACK_ALIGNMENT, 4)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.polygonOffset(0, 0)
  gl.sampleCoverage(1, false)
  gl.scissor(0, 0, gl.canvas.width, gl.canvas.height)
  gl.stencilFunc(gl.ALWAYS, 0, 0xFFFFFFFF)
  gl.stencilMask(0xFFFFFFFF)
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)

  return gl
}