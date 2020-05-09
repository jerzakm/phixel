<script>
  import { filterDictionary } from "../../filterManager.ts";
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

  $: filter && updateFilter();

  let lastFilterVal;

  function updateFilter() {
    const currentFilterVal = JSON.stringify(tempProject.filters[filter.id]);
    if (lastFilterVal !== currentFilterVal) {
      lastFilterVal = JSON.stringify(filter.value);
      tempProject.filters[filter.id] = filter.value;
      currentProject.set(tempProject);
      filterUpdate.set(true);
    }
  }
</script>

<style>
  .filter-options {
    width: 100%;
    min-height: 100px;
    background-color: rgb(245, 245, 245);
  }
</style>

{#if filter && filter.value.optionsOpen && filterOptions}
  <div class="filter-options">
    {#each filterOptions as option}
      {#if option.type == 'slider'}
        <Slider
          class="filterOptionSlider"
          bind:value={filter.value.options.size}
          min={option.min}
          max={option.max}
          step={option.step}
          discrete />
      {/if}
    {/each}
  </div>
{/if}
