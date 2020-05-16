<script>
  import { onMount } from "svelte";
  import * as Filters from "pixi-filters";
  import { currentProject } from "../../stores";
  import { refreshFilters } from "../../filterManager";

  import { Renderer, Sprite, Ticker, Container, Texture } from "pixi.js";

  const renderer = new Renderer({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    forceFXAA: false,
    powerPreference: "high-performance"
  });

  let ticker = new Ticker();
  let stage = new Container();

  window.addEventListener("resize", () => {
    renderer.view.width = window.innerWidth;
    renderer.view.height = window.innerHeight;
  });

  // IMAGE RENDER
  let currentSprite = "";
  let currentFilters = [];

  let sprite = new Sprite();
  stage.addChild(sprite);
  const scale = 1.0;
  sprite.scale.x = scale;
  sprite.scale.y = scale;

  let lastFilters;

  const unsubscribeProject = currentProject.subscribe(project => {
    // reload

    if (currentSprite != project.image) {
      let texture = Texture.from(project.image);
      sprite.texture = texture;
      currentSprite = project.image;
    }

    // TODO are filters different?
    lastFilters = project.filters;
    const newFilters = refreshFilters(project.filters);
    sprite.filters = newFilters;
  });

  ticker.add(() => {
    renderer.render(stage);
  });

  ticker.start();

  document.body.appendChild(renderer.view);
  renderer.view.className = "main-canvas";
</script>
