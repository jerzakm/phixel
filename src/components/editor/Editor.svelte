<script>
  import FilterList from "./FilterList.svelte";
  import FilterOptionWindow from "./FilterOptionWindow.svelte";
  import CanvasWEBGL from "./CanvasWEBGL.svelte";
  import { currentProject, selectedFilter } from "../../stores/stores";
  import Button, { Label } from "@smui/button";
  import { onMount } from "svelte";
  let tempProject;
  let selectedFilterUuid;

  currentProject.subscribe(project => {
    tempProject = project;
  });

  selectedFilter.subscribe(selectedFilter => {
    selectedFilterUuid = selectedFilter;
  });

  let fileInput;

  onMount(() => {
    fileInput.addEventListener("change", event => {
      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        if (file.type && file.type.indexOf("image") === -1) {
          console.log("File is not an image.", file.type, file);
          return;
        }
        const reader = new FileReader();
        reader.addEventListener("load", event => {
          tempProject.image = event.target.result;
          currentProject.set(tempProject);
        });
        reader.readAsDataURL(file);
      }
    });
  });
</script>

<style>
  .card {
    background-color: #ffffff;
    min-height: 50px;
    position: fixed;
    top: 96px;
    right: 32px;
    width: 270px;
    display: flex;
    flex-direction: row;
  }
  .filters {
    background-color: #dddddd;
    width: 100%;
    padding: 5px;
  }

  .user-img {
    position: fixed;
    top: 80px;
    left: 10px;
    z-index: 500;
  }
</style>

<CanvasWEBGL imgPath={tempProject.image} />

<div class="card">
  <div class="filters">
    <FilterList />
  </div>
</div>

<div class="user-img">
  <h3>(temp) load image:</h3>
  <input
    type="file"
    id="file-selector"
    accept=".jpg, .jpeg, .png"
    bind:this={fileInput} />
  <!-- <Button
    class="new-filter-button"
    variant="raised"
    color="primary"
    on:click={() => {
      console.log('kk');
    }}>
    <Label>Load image..</Label>
  </Button> -->
</div>

{#if selectedFilterUuid}
  <FilterOptionWindow />
{/if}
