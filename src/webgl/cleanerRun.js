import * as twgl from 'twgl.js'

export class WebGLTest {
  constructor() {
    // Make Canvas
    this.initCanvas()
    this.gl = twgl.getContext(this.canvas)
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


}