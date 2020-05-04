<script>
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Button, { Label } from "@smui/button";
  import IconButton, { Icon } from "@smui/icon-button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";

  import { filterDictionary } from "../../filterManager.ts";

  let filterGalleryDialog;
  let clicked = "nope";

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
        name: i,
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

  function addFilter(filter) {
    tempProject.filters.push({
      filterRef: filter.filterRef,
      enabled: true,
      options: {}
    });
    currentProject.set(tempProject);
    console.log(tempProject);
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
  .filter-list-container {
    display: flex;
    flex-direction: column;
  }
</style>

<div class="filter-list-container">

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
            <Label>{filter.value.filterRef}</Label>
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

  <Button
    class="new-filter-btn"
    on:click={() => filterGalleryDialog.open()}
    variant="raised"
    color="secondary">
    <Label>Add filters</Label>
  </Button>

</div>

<div>
  <Dialog
    bind:this={filterGalleryDialog}
    aria-labelledby="simple-title"
    aria-describedby="simple-content">
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">Add a new filter</Title>
    <Content id="simple-content">
      {#each filterDictionary as filter}
        <Button
          on:click={() => addFilter(filter)}
          variant="raised"
          color="secondary">
          <Label>{filter.name}</Label>
        </Button>
      {/each}
    </Content>
    <Actions>
      <Button on:click={() => (clicked = 'Yes')}>
        <Label>Close</Label>
      </Button>
    </Actions>
  </Dialog>
</div>
