<script>
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Button, { Label } from "@smui/button";
  import IconButton, { Icon } from "@smui/icon-button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import FilterGallery from "./FilterGallery.svelte";
  import Sortable from "svelte-sortablejs";
  import {
    currentProject,
    filterUpdate,
    selectedFilter
  } from "../../stores/stores";
  import { flip } from "svelte/animate";

  import { selectFilter } from "../../stores/filterActions.js";

  let filterGalleryDialog;
  let clicked = "nope";

  let tempProject = {};
  let list = [];
  let options = {
    draggable: ".filters"
  };

  currentProject.subscribe(project => {
    tempProject = project;

    list = [];
    for (let i = 0; i < project.filters.length; i++) {
      list.push({
        id: i,
        name: i,
        value: project.filters[i]
      });
    }
  });

  filterUpdate.subscribe(update => {
    if (update == true) {
      updateFilters();
      filterUpdate.set(false);
    }
  });

  function updateFilters() {
    const fList = [];
    for (const filter of list) {
      if (!filter.remove) {
        fList.push(filter.value);
      }
    }
    tempProject.filters = fList;
    currentProject.set(tempProject);
  }

  function removeFilter(filter) {
    filter.remove = true;
    updateFilters();
  }

  $: list && updateFilters();

  let currentSelected;

  selectedFilter.subscribe(s => {
    currentSelected = s;
  });
</script>

<style>
  .filters {
    list-style-type: none;
    width: 100%;
  }
  .filter-container {
    background-color: #eeeeee;
    display: flex;
    width: 100%;
    margin-bottom: 8px;
  }
  .filter-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
  .filter-list-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .filter-entry-min {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
  }
</style>

<div class="filter-list-container">
  <Sortable {options} bind:list>
    {#each list as filter (filter.id)}
      <li
        sortable-id={filter.id}
        animate:flip={{ duration: 250 }}
        class="filters">
        <div class="filter-container">
          <div
            class={currentSelected === filter.value.id ? 'selected-filter filter-entry' : 'filter-entry'}>
            <div class="filter-entry-min">
              <Button on:click={() => selectFilter(filter.value.id)}>
                {filter.value.filterRef}
              </Button>
              <IconButton
                class="material-icons"
                on:click={() => removeFilter(filter)}>
                delete
              </IconButton>
              <FormField>
                <Checkbox bind:checked={filter.value.enabled} />
              </FormField>
            </div>
          </div>
        </div>
      </li>
    {/each}
  </Sortable>

  <Button
    class="new-filter-btn"
    on:click={() => filterGalleryDialog.open()}
    variant="raised"
    color="secondary">
    <Label>Add filters</Label>
  </Button>
  <span>
    Hint: you can drag filters up and down the list to change when they are
    applied.
  </span>
  <span>Clicking on filter name opens the options window.</span>
</div>
<FilterGallery bind:filterGalleryDialog />
