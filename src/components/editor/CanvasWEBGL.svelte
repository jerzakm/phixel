<script>
  import { onMount } from "svelte";
  import {
    draw,
    setFramebuffer,
    setRectangle,
    createProgramFromString,
    resizeCanvasToDisplaySize,
    createAndSetupTexture,
    setupShader
  } from "../../webgl/renderUtils.js";
  import { DefaultShader } from "../../webgl/shaders/DefaultShader";
  import { PixelateShader } from "../../webgl/shaders/PixelateShader";
  import { GreyscaleShader } from "../../webgl/shaders/GreyscaleShader";
  import { PaletteShader } from "../../webgl/shaders/PaletteShader";
  import { BloomShader } from "../../webgl/shaders/BloomShader";
  import { currentProject } from "../../stores";

  let canvas;

  onMount(() => {
    var image = new Image();
    const imgPath = "test_ct.jpg";
    image.crossOrigin = "";
    image.src = imgPath;
    image.onload = function() {
      render(image);
    };

    function render(image) {
      const gl = canvas.getContext("webgl");

      // Create a buffer to put three 2d clip space points in
      const positionBuffer = gl.createBuffer();
      // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // Set a rectangle the same size as the image.
      setRectangle(gl, 0, 0, image.width, image.height);

      // provide texture coordinates for the rectangle.
      const texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          0.0,
          0.0,
          1.0,
          0.0,
          0.0,
          1.0,
          0.0,
          1.0,
          1.0,
          0.0,
          1.0,
          1.0
        ]),
        gl.STATIC_DRAW
      );

      // Create a texture and put the image in it.
      const originalImageTexture = createAndSetupTexture(gl);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      // create 2 textures and attach them to framebuffers.
      const textures = [];
      const framebuffers = [];

      for (let i = 0; i < 2; i++) {
        const texture = createAndSetupTexture(gl);
        textures.push(texture);

        // make the texture the same size as the image
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          image.width,
          image.height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        );

        // Create a framebuffer
        const fbo = gl.createFramebuffer();
        framebuffers.push(fbo);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // Attach a texture to it.
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          texture,
          0
        );
      }

      const cleanShader = DefaultShader.build(gl);
      const pixelateShader = PixelateShader.build(gl, {
        size: 4
      });
      const bloomShader = BloomShader.build(gl);
      const greyscaleShader = GreyscaleShader.build(gl);
      const paletteLimiter = PaletteShader.build(gl);

      const shaders = [paletteLimiter, pixelateShader, bloomShader];

      resizeCanvasToDisplaySize(gl.canvas, 1.5);

      drawEffects();

      function drawEffects(name) {
        // requestAnimationFrame(drawEffects);
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        console.log("anim frame");

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2; // 2 components per iteration
        let type = gl.FLOAT; // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0; // start at the beginning of the buffer

        gl.vertexAttribPointer(
          cleanShader.uniforms.positionLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );
        gl.enableVertexAttribArray(cleanShader.uniforms.texcoordLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

        for (let i = 0; i < shaders.length; i++) {
          setupShader(gl, image, shaders[i]);
          // Setup to draw into one of the framebuffers.
          setFramebuffer(
            gl,
            shaders[i],
            framebuffers[i % 2],
            image.width,
            image.height
          );

          draw(gl);

          // for the next draw, use the texture we just rendered to.
          gl.bindTexture(gl.TEXTURE_2D, textures[i % 2]);
          // increment count so we use the other texture next time.
        }

        setupShader(gl, image, cleanShader);
        // finally draw the result to the canvas.
        gl.uniform1f(cleanShader.uniforms.flipYLocation, -1); // need to y flip for canvas

        setFramebuffer(
          gl,
          cleanShader,
          null,
          gl.canvas.width,
          gl.canvas.height
        );
        draw(gl);
      }
    }
  });
</script>

<canvas bind:this={canvas} />
