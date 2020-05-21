<script>
  import Textfield, { Input, Textarea } from "@smui/textfield";
  import ColorPicker from "./ColorPicker.svelte";
  import { shaderDictionary } from "../../webgl/shaderManager.js";
  import { onMount } from "svelte";
  import {
    filterUpdate,
    currentProject,
    selectedFilter
  } from "../../stores/stores";
  import { updateFilterProperty } from "../../stores/filterActions.js";

  let filter;

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

  // $: filter && update();

  let mounted;

  onMount(() => {
    mounted = true;
  });
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

{#if mounted}
  <div class="filter-option-container">
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
                on:input={event => {
                  updateFilterProperty(selecteduuid, option.filterProperty, event.target.value);
                }}
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
{/if}
