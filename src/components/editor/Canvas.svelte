<script>
  import { onMount } from "svelte";
  import * as PIXI from "pixi.js";
  import * as Filters from "pixi-filters";
  import { currentProject } from "../../stores";
  import { refreshFilters } from "../../filterManager";

  const renderer = new PIXI.Renderer({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    forceFXAA: false,
    powerPreference: "high-performance"
  });

  let ticker = new PIXI.Ticker();
  let stage = new PIXI.Container();

  window.addEventListener("resize", () => {
    renderer.view.width = window.innerWidth;
    renderer.view.height = window.innerHeight;
  });

  // IMAGE RENDER
  let currentSprite = "";
  let currentFilters = [];

  const sprite = new PIXI.Sprite();
  stage.addChild(sprite);
  const scale = 1.0;
  sprite.scale.x = scale;
  sprite.scale.y = scale;

  let lastFilters;

  const unsubscribeProject = currentProject.subscribe(project => {
    // reload
    if (currentSprite != project.image) {
      let texture = PIXI.Texture.from(project.image);
      sprite.texture = texture;
      currentSprite = project.image;
    }

    //are filters different?
    if (JSON.stringify(project.filters) != JSON.stringify(lastFilters)) {
      console.log("filters are different");
      lastFilters = project.filters;
      const newFilters = refreshFilters(project.filters);
      sprite.filters = newFilters;
    }
  });

  ticker.add(() => {
    renderer.render(stage);
  }, PIXI.UPDATE_PRIORITY.LOW);

  ticker.start();

  document.body.appendChild(renderer.view);
  renderer.view.className = "main-canvas";

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
</script>
