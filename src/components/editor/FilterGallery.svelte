<script>
  import Button, { Label } from "@smui/button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import { shaderDictionary } from "../../webgl/shaderManager.js";
  import { currentProject } from "../../stores/stores";
  import { uuidv4 } from "../../util.js";
  import { addNewFilter } from "../../stores/filterActions.js";
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
</script>

<Dialog
  bind:this={filterGalleryDialog}
  aria-labelledby="simple-title"
  aria-describedby="simple-content">
  <Title id="simple-title">Add a new filter</Title>
  <Content id="simple-content">
    {#each shaderDictionary as filter}
      <Button
        on:click={() => addNewFilter(filter)}
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
