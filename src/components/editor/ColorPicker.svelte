<script>
  import Pickr from "@simonwep/pickr";
  import { onMount, onDestroy } from "svelte";

  let el;
  let pickr;

  export let color;
  export let noDestroy;

  let oldColor = color;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  onDestroy(() => {
    if (pickr) {
      pickr.destroyAndRemove();
    }
  });

  onMount(() => {
    pickr = Pickr.create({
      el: el,
      theme: "nano", // or 'monolith', or 'nano'
      default: color,
      comparison: false,
      swatches: [
        "rgba(244, 67, 54, 1)",
        "rgba(233, 30, 99, 1)",
        "rgba(156, 39, 176, 1)",
        "rgba(103, 58, 183, 1)",
        "rgba(63, 81, 181, 1",
        "rgba(33, 150, 243, 1)",
        "rgba(3, 169, 244, 1)",
        "rgba(0, 188, 212, 1)",
        "rgba(0, 150, 136, 1)",
        "rgba(76, 175, 80, 1)",
        "rgba(139, 195, 74, 1)",
        "rgba(205, 220, 57, 1)",
        "rgba(255, 235, 59, 1)",
        "rgba(255, 193, 7, 1)"
      ],

      components: {
        // Main components
        preview: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          save: true,
          clear: noDestroy ? false : true
        }
      }
    });

    if (!noDestroy) {
      pickr.getRoot().button.addEventListener("pointerdown", e => {
        if (e.button == 2) {
          if (pickr.getColor() && !noDestroy) {
            dispatch("removeColor", {
              color: pickr
                .getColor()
                .toHEXA()
                .toString()
            });
            pickr.setColor(null);
          }
        }
      });
    }

    pickr
      .on("init", instance => {
        // console.log("init", instance);
      })
      .on("hide", instance => {
        // console.log("hide", instance);
      })
      .on("show", (color, instance) => {
        // console.log("show", color, instance);
      })
      .on("save", (color, instance) => {
        const c = color ? color.toHEXA().toString() : null;
        console.log(c);
        dispatch("colorChange", {
          oldColor,
          color: c
        });
        oldColor = color ? color.toHEXA().toString() : null;
      })
      .on("clear", instance => {})
      .on("change", (color, instance) => {
        // console.log("change", color, instance);
        pickr.applyColor();
      })
      .on("changestop", instance => {
        // console.log("changestop", instance);
      })
      .on("cancel", instance => {
        // console.log("cancel", instance);
      })
      .on("swatchselect", (color, instance) => {
        // console.log("swatchselect", color, instance);
      })
      .on("contextmenu", (color, instance) => {
        // console.log("swatchselect", color, instance);
      });
  });
</script>

<style>

</style>

<div bind:this={el} id={color} class="color-picker" />
