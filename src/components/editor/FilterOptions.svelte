<script>
  import { filterDictionary } from "../../filterManager.js";
  import Slider from "@smui/slider";
  import Textfield, { Input, Textarea } from "@smui/textfield";

  export let filter;

  import { filterUpdate, currentProject } from "../../stores";

  let filterOptions;

  for (const f of filterDictionary) {
    if (f.filterRef == filter.value.filterRef) {
      filterOptions = f.options;
    }
  }

  let tempProject;

  currentProject.subscribe(project => {
    tempProject = project;
  });

  function update() {
    tempProject.filters[filter.value.id] = filter.value;
    filterUpdate.set(true);
  }
</script>

<style>
  .filter-options-container {
    width: 100%;
    background-color: rgb(245, 245, 245);
  }
</style>

{#if filter && filterOptions}
  <div class="filter-options-container">
    {#each filterOptions as option}
      {#if option.type == 'slider'}
        <div class="filter-options-slider-container">
          <span>{option.name}</span>
          <Slider
            class="filter-options-slider"
            on:click={() => {
              update();
            }}
            on:mousemove={() => {
              update();
            }}
            bind:value={filter.value.options[`${option.filterProperty}`]}
            min={option.min}
            max={option.max}
            step={option.step}
            discrete />
          <span>{filter.value.options.size}</span>
        </div>
      {/if}
    {/each}
  </div>
{/if}
