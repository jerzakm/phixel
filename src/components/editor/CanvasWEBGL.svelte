<script>
  import { onMount } from "svelte";
  import {
    draw,
    setFramebuffer,
    setRectangle,
    createProgramFromString,
    resizeCanvasToDisplaySize,
    createAndSetupTexture,
    setupShader,
    stateReset
  } from "../../webgl/renderUtils.js";

  import Slider from "@smui/slider";

  import { uuidv4 } from "../../util.js";
  import { DefaultShader } from "../../webgl/shaders/DefaultShader";
  import { PixelateShader } from "../../webgl/shaders/PixelateShader";
  import { GreyscaleShader } from "../../webgl/shaders/GreyscaleShader";
  import { PaletteShader } from "../../webgl/shaders/PaletteShader";
  import { BloomShader } from "../../webgl/shaders/BloomShader";
  import { currentProject } from "../../stores/stores";
  import { shaderDictionary } from "../../webgl/shaderManager.js";

  export let imgPath;

  let canvas;
  let scale = 100;

  let img;

  function resizeCanvasToImgSize() {
    canvas.width = img.width;
    canvas.height = img.height;
    scale = 100;
    rescaleImg();
  }

  function rescaleImg() {
    if (canvas) {
      canvas.style.width = `${(scale / 100) * img.width}px`;
    }
  }

  $: img && resizeCanvasToImgSize();
  $: scale && rescaleImg();

  function renderImage(path) {
    if (path) {
      const image = new Image();
      image.src = path;
      image.crossOrigin = "";
      image.onload = function() {
        render(image);
        img = image;
      };
    } else {
      console.log("image undefined");
    }
  }

  $: renderImage(imgPath);

  let rendererId = "";

  function render(image) {
    const gl = document.getElementById("webgl-img-canvas").getContext("webgl");

    const thisRendererId = uuidv4();
    let rendererId = thisRendererId;

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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

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

    const shaders = [];
    let currentShaderOptions = "";
    // SHADER UPDATER
    currentProject.subscribe(project => {
      const fUpdate = JSON.stringify(project.filters);
      if (fUpdate !== currentShaderOptions) {
        shaders.length = 0;
        project.filters.map(filter => {
          if (filter.enabled) {
            const builder = shaderDictionary.find(s => {
              return s.filterRef == filter.filterRef;
            });
            const shader = builder.build(gl, filter.options);
            shaders.push(shader);
          }
        });
        currentShaderOptions = fUpdate;
      }
    });

    // resizeCanvasToDisplaySize(gl.canvas, 1);

    let previousDelta = 0;
    let fpsLimit = 30;

    function cleanup() {
      shaders.length = 0;
      stateReset(gl);
    }

    update();
    function update(currentDelta) {
      if (rendererId == thisRendererId) {
        requestAnimationFrame(update);
      }

      const delta = currentDelta - previousDelta;

      if (fpsLimit && delta < 1000 / fpsLimit) {
        return;
      }

      drawWithShaders();
      previousDelta = currentDelta;
    }

    function drawWithShaders() {
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

      setFramebuffer(gl, cleanShader, null, gl.canvas.width, gl.canvas.height);
      draw(gl);
      if (!rendererId == thisRendererId) {
        cleanup();
      }
    }
  }

  onMount(() => {
    let dragging = false;
    const canvasOrigin = { x: 0, y: 0 };
    const mouseOrigin = { x: 0, y: 0 };
    canvas.style.zIndex = -1;
    canvas.addEventListener("pointerdown", e => {
      dragging = true;
      canvas.style.transition = "unset";

      canvasOrigin.x = canvas.getBoundingClientRect().x;
      canvasOrigin.y = canvas.getBoundingClientRect().y;
      mouseOrigin.x = e.clientX;
      mouseOrigin.y = e.clientY;
    });
    canvas.addEventListener("pointerup", e => {
      dragging = false;
      const canvasRect = canvas.getBoundingClientRect();

      const screenCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };

      if (
        canvasRect.x + canvasRect.width < 80 ||
        canvasRect.x > window.innerWidth - 80 ||
        canvasRect.y > window.innerHeight - 80 ||
        canvasRect.y + canvasRect.height < 80
      ) {
        canvas.style.transition =
          "all 500ms cubic-bezier(0.485, 0.305, 0.210, 0.740)";
        canvas.style.left = `${20}px`;
        canvas.style.top = `${20}px`;
      }
    });
    canvas.addEventListener("pointermove", e => {
      if (dragging) {
        canvas.style.left = `${canvasOrigin.x - mouseOrigin.x + e.clientX}px`;
        canvas.style.top = `${canvasOrigin.y - mouseOrigin.y + e.clientY}px`;
      }
    });
    canvas.addEventListener("wheel", e => {
      console.log(e);
      e.deltaY > 0 ? (scale += 10) : (scale -= 10);
    });
  });
</script>

<style>
  .canvas-size-slider-container {
    position: fixed;
    top: 5px;
    left: 200px;
    width: 200px;
    z-index: 500;
  }
  .img-scale {
    color: white;
  }

  #webgl-img-canvas {
    position: fixed;
  }
</style>

<canvas id="webgl-img-canvas" bind:this={canvas} />

<div class="canvas-size-slider-container">
  <span class="img-scale">Image scale: {scale}%</span>
  <Slider bind:value={scale} min={10} max={500} step={10} discrete />
</div>
