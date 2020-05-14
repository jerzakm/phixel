<script>
  import { filterDictionary } from "../../filterManager.ts";
  import Slider from "@smui/slider";
  import { HsvPicker } from "svelte-color-picker";
  import Textfield, { Input, Textarea } from "@smui/textfield";

  let filter;

  import { filterUpdate, currentProject, selectedFilter } from "../../stores";

  let filterOptions;

  let tempProject;

  let selecteduuid;

  currentProject.subscribe(project => {
    tempProject = project;
  });

  selectedFilter.subscribe(s => {
    selecteduuid = s;
    if (s) {
      for (const f of tempProject.filters) {
        if (f.id == s) {
          filter = f;
        }
      }
      for (const f of filterDictionary) {
        if (f.filterRef == filter.filterRef) {
          filterOptions = f.options;
        }
      }
    }
  });

  function update() {
    const i = tempProject.filters.findIndex(f => {
      return f.id == filter.id;
    });
    if (i) {
      tempProject.filters[i] = filter;
      currentProject.set(tempProject);
    }
    // tempProject.filters[filter.value.id] = filter.value;
    filterUpdate.set(true);
  }

  function colorCallback(rgba) {
    console.log(rgba.detail);
  }

  $: filter && update();
</script>

<style>
  .filter-option-container {
    min-width: 100px;
    min-height: 100px;
    background-color: #dddddd;
    position: fixed;
    top: 100px;
    right: 305px;
  }

  .filter-options-container {
    width: 100%;
    background-color: rgb(245, 245, 245);
  }
</style>

<div class="filter-option-container">
  {selecteduuid}
  {#if filter && filterOptions}
    <div class="filter-options-container">
      {#each filterOptions as option}
        {#if option.type == 'slider'}
          <div class="filter-options-slider-container">
            <span>{option.name}</span>
            <input
              type="range"
              bind:value={filter.options[`${option.filterProperty}`]}
              min={option.min}
              max={option.max}
              step={option.step} />
            <!-- <Slider
              class="filter-options-slider"
              bind:value={filter.options[`${option.filterProperty}`]}
              min={option.min}
              max={option.max}
              step={option.step}
              discrete /> -->
            <span>{filter.options[`${option.filterProperty}`]}</span>
          </div>
        {:else if option.type == 'colorPicker'}
          <div
            class="filter-options-colorPicker-container"
            on:click={() => console.log(filter, option)}>
            <span>{option.name}</span>
            <div>{filter.options[`${option.filterProperty}`]}</div>
            <HsvPicker on:colorChange={colorCallback} startColor={'#FBFBFB'} />
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
