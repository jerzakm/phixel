<script>
  import Textfield, { Input, Textarea } from "@smui/textfield";
  import ColorPicker from "./ColorPicker.svelte";
  import { shaderDictionary } from "../../webgl/shaderManager.js";

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
      for (const f of shaderDictionary) {
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
    tempProject.filters[i] = filter;
    currentProject.set(tempProject);
    filterUpdate.set(true);
  }

  $: filter && update();
</script>

<style>
  .filter-option-container {
    min-width: 100px;
    min-height: 100px;
    max-width: 400px;
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
  {selecteduuid} //
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
            <span>{filter.options[`${option.filterProperty}`]}</span>
          </div>
        {:else if option.type == 'colorPicker'}
          <div class="filter-options-colorPicker-container">
            <span class="filter-name">{option.name}</span>
            <div class="color-list">
              {#each filter.options[`${option.filterProperty}`] as color, i}
                <ColorPicker
                  {color}
                  on:colorChange={event => {
                    filter.options[`${option.filterProperty}`][i] = event.detail.color;
                  }} />
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
