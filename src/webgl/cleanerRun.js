import * as twgl from 'twgl.js'

export class WebGLTest {
  constructor() {
    // Make Canvas
    this.initCanvas()
    this.gl = twgl.getContext(this.canvas)
    this.loadImage()
    this.initBufferArray()
    this.setupTextures()
  }

  initCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "twgl-canvas";
    this.canvas.style.width = window.innerWidth;
    this.canvas.style.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
  }

  loadImage() {
    this.image = new Image();
    const imgPath = 'test_ct.jpg'
    requestCORSIfNotSameOrigin(this.image, imgPath)
    this.image.src = imgPath;
    this.image.onload = function () {

    };
  }

  initBufferArray() {
    // Create a buffer to put three 2d clip space points in
    this.positionBuffer = this.gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(this.gl, 0, 0, this.image.width, this.image.height);

    // provide texture coordinates for the rectangle.
    this.texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0,
    ]), this.gl.STATIC_DRAW);
  }

  setupTextures() {

  }
}


function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
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