<script>
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Button, { Label } from "@smui/button";
  import IconButton, { Icon } from "@smui/icon-button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import { filterDictionary } from "../../filterManager.ts";
  import FilterGallery from "./FilterGallery.svelte";
  import Sortable from "svelte-sortablejs";
  import { currentProject, filterUpdate } from "../../stores";
  import FilterOptions from "./FilterOptions.svelte";

  let filterGalleryDialog;
  let clicked = "nope";

  let tempProject = {};
  let list = [];
  let options = {
    draggable: ".filters"
  };

  currentProject.subscribe(project => {
    // console.log(
    //   JSON.stringify(tempProject.filters),
    //   JSON.stringify(project.filters)
    // );
    if (
      JSON.stringify(tempProject.filters) != JSON.stringify(project.filters)
    ) {
      console.log("filters Differ!!!!!");
    }
    if (JSON.stringify(tempProject) != JSON.stringify(project)) {
      console.log("change in the project");
      tempProject = project;
    }

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
      filterUpdate.set(false);
      updateFilters();
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
    {#each list as filter (filter.name)}
      <li sortable-id={filter.name} class="filters">
        <div class="filter-container">
          <div class="filter-entry">
            <div class="filter-entry-min">
              <Button
                class="filter-name-button"
                on:click={() => (filter.value.optionsOpen ? (filter.value.optionsOpen = false) : (filter.value.optionsOpen = true))}>
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
            <FilterOptions {filter} />
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

</div>
<FilterGallery bind:filterGalleryDialog />
