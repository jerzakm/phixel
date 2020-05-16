<script>
  import Button, { Label } from "@smui/button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import { filterDictionary } from "../../filterManager.js";
  import { currentProject } from "../../stores";
  import { uuidv4 } from "../../util.js";
  export let filterGalleryDialog;

  let tempProject = {};
  let list;

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

  function addFilter(filter) {
    tempProject.filters.push({
      id: uuidv4(),
      filterRef: filter.filterRef,
      enabled: true,
      options: filter.defaultOptions
    });
    currentProject.set(tempProject);
  }
</script>

<Dialog
  bind:this={filterGalleryDialog}
  aria-labelledby="simple-title"
  aria-describedby="simple-content">
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
    <Button>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>
