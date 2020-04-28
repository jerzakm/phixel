<script>
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Button, { Label } from "@smui/button";
  import IconButton, { Icon } from "@smui/icon-button";

  import { flip } from "svelte/animate";
  import { quintOut, quadIn, sineIn } from "svelte/easing";
  import Sortable from "svelte-sortablejs";

  import { currentProject } from "../../stores";

  let tempProject = {};
  let list = [];
  let options = {
    draggable: ".filters"
  };

  const unsubscribeProject = currentProject.subscribe(project => {
    tempProject = project;
    list = [];
    for (let i = 0; i < project.filters.length; i++) {
      list.push({
        id: i,
        name: project.filters[i].filterRef,
        value: project.filters[i]
      });
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
</script>

<style>
  .filters {
    list-style-type: none;
  }
  .filter-container {
    margin: 5px;
    background-color: #eeeeee;
    display: flex;
  }
  .filter-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
  }
</style>

<Sortable {options} bind:list>
  {#each list as filter (filter.name)}
    <li
      animate:flip={{ duration: 150, easing: sineIn }}
      sortable-id={filter.name}
      class="filters">
      <div class="filter-container">
        <div class="filter-entry">
          <FormField>
            <Checkbox bind:checked={filter.value.enabled} />
          </FormField>
          <Label>{filter.name}</Label>
          <IconButton
            class="material-icons"
            on:click={() => removeFilter(filter)}>
            delete
          </IconButton>
        </div>
      </div>
    </li>
  {/each}
</Sortable>
