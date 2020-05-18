<script>
  import * as twgl from "twgl.js";

  const vs = `
  // we will always pass a 0 to 1 unit quad
// and then use matrices to manipulate it
attribute vec4 position;

uniform mat4 matrix;
uniform mat4 textureMatrix;

varying vec2 texcoord;

void main () {
  gl_Position = matrix * position;

  texcoord = (textureMatrix * position).xy;
}`;
  const vs2 = `
  // we will always pass a 0 to 1 unit quad
// and then use matrices to manipulate it
attribute vec4 position;

uniform mat4 matrix;
uniform mat4 textureMatrix;

varying vec2 texcoord;

void main () {
  gl_Position = matrix * position;

  texcoord = (textureMatrix * position *2.0).xy;
}`;
  const fs = `precision mediump float;

varying vec2 texcoord;
uniform sampler2D texture;

void main() {
  if (texcoord.x < 0.0 || texcoord.x > 1.0 ||
      texcoord.y < 0.0 || texcoord.y > 1.0) {
    discard;
  }
  gl_FragColor = texture2D(texture, texcoord);
}`;

  const canvas = document.createElement("canvas");
  canvas.id = "twgl-canvas";
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gl = canvas.getContext("webgl");
  document.body.appendChild(canvas);
  let m4 = twgl.m4;

  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  const programInfo2 = twgl.createProgramInfo(gl, [vs2, fs]);

  var bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);

  // we're only using 1 texture so just make and bind it now
  var tex = twgl.createTexture(
    gl,
    {
      src: "test_ct.jpg",
      crossOrigin: "" // not needed if image on same origin
    },
    function(err, tex, img) {
      // wait for the image to load because we need to know it's size
      startRendering(img);
    }
  );

  function startRendering(img) {
    requestAnimationFrame(render);
    function render(time) {
      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      drawImage(
        gl.canvas.width,
        gl.canvas.height,
        tex,
        img.width,
        img.height,
        0,
        0
      );
      requestAnimationFrame(render);
    }

    function drawImage(
      targetWidth,
      targetHeight,
      tex,
      texWidth,
      texHeight,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      dstX,
      dstY,
      dstWidth,
      dstHeight
    ) {
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
        texture: tex
      };

      // these adjust the unit quad to generate texture coordinates
      // to select part of the src texture

      // NOTE: no check is done that srcX + srcWidth go outside of the
      // texture or are in range in any way. Same for srcY + srcHeight

      m4.translate(tmat, [srcX / texWidth, srcY / texHeight, 0], tmat);
      m4.scale(tmat, [srcWidth / texWidth, srcHeight / texHeight, 1], tmat);

      // these convert from pixels to clip space
      m4.ortho(0, targetWidth, targetHeight, 0, -1, 1, mat);

      // these move and scale the unit quad into the size we want
      // in the target as pixels
      m4.translate(mat, [dstX, dstY, 0], mat);
      m4.scale(mat, [dstWidth, dstHeight, 1], mat);

      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.setUniforms(programInfo, uniforms);
      twgl.drawBufferInfo(gl, bufferInfo);
    }
  }
</script>
