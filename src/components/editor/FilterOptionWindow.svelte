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
  import IconButton, { Icon } from "@smui/icon-button";

  let filter;

  let filterOptions;

  let tempProject;

  let selecteduuid;

  let filterOptionWindow;

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

  function refreshFilter() {
    const filterIndex = tempProject.filters.findIndex(filter => {
      return filter.id == selecteduuid;
    });
    filter = tempProject.filters[filterIndex];
  }

  onMount(() => {
    filterOptionWindow.oncontextmenu = () => {
      return false;
    };
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

<div class="filter-option-container" bind:this={filterOptionWindow}>
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
                  noDestroy={option.noDestroy}
                  {color}
                  on:removeColor={event => {
                    const index = filter.options[`${option.filterProperty}`].findIndex(
                      color => {
                        return color == event.detail.color;
                      }
                    );
                    filter.options[`${option.filterProperty}`].splice(index, 1);
                    updateFilterProperty(selecteduuid, option.filterProperty, filter.options[`${option.filterProperty}`]);
                    filterUpdate.set(true);
                  }}
                  on:colorChange={event => {
                    const index = filter.options[`${option.filterProperty}`].findIndex(
                      color => {
                        return color == event.detail.oldColor;
                      }
                    );
                    filter.options[`${option.filterProperty}`][index] = event.detail.color;
                    for (let i = filter.options[`${option.filterProperty}`].length; i >= 0; i--) {
                      if (!filter.options[`${option.filterProperty}`][i]) {
                        filter.options[`${option.filterProperty}`].splice(i, 1);
                      }
                    }
                    updateFilterProperty(selecteduuid, option.filterProperty, filter.options[`${option.filterProperty}`]);
                  }} />
              {/each}
              {#if option.qty > 1}
                <Icon
                  class="material-icons color-picker-add"
                  on:click={() => {
                    refreshFilter();
                    filter.options[`${option.filterProperty}`].push(`#FFFFFF`);
                    updateFilterProperty(selecteduuid, option.filterProperty, filter.options[`${option.filterProperty}`]);
                  }}>
                  add
                </Icon>
              {/if}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
