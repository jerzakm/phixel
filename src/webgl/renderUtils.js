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