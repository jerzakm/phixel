<script>
  import Button, { Label } from "@smui/button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import { filterDictionary } from "../../filterManager.ts";
  import { currentProject } from "../../stores";
  export let filterGalleryDialog;

  function addFilter(filter) {
    tempProject.filters.push({
      filterRef: filter.filterRef,
      enabled: true,
      options: {}
    });
    currentProject.set(tempProject);
    console.log(tempProject);
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
