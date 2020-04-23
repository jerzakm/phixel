<script>
  import { onMount } from "svelte";
  import * as PIXI from "pixi.js";
  import * as Filters from "pixi-filters";
  import { filterArray, currentProject } from "../../stores";

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

  let currentSprite = "";

  const sprite = PIXI.Sprite.from("empty.jpg");
  stage.addChild(sprite);
  const scale = 1.0;
  sprite.scale.x = scale;
  sprite.scale.y = scale;

  const unsubscribeProject = currentProject.subscribe(value => {
    if (currentSprite != value.image) {
      let texture = PIXI.Texture.from(value.image);
      sprite.texture = texture;
      currentSprite = value.image;
    }
  });

  const unsubscribeFilters = filterArray.subscribe(value => {
    console.log("new filters arrived");
    sprite.filters = [];
    value.map(v => sprite.filters.push(v.value));
  });

  ticker.add(() => {
    renderer.render(stage);
  }, PIXI.UPDATE_PRIORITY.LOW);

  ticker.start();

  document.body.appendChild(renderer.view);
  renderer.view.className = "main-canvas";

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
</script>
