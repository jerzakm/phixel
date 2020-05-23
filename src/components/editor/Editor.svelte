<script>
  import FilterList from "./FilterList.svelte";
  import FilterOptionWindow from "./FilterOptionWindow.svelte";
  import CanvasWEBGL from "./CanvasWEBGL.svelte";
  import { currentProject, selectedFilter } from "../../stores/stores";

  let imgPath;
  let selectedFilterUuid;

  currentProject.subscribe(project => {
    imgPath = project.image;
  });

  selectedFilter.subscribe(selectedFilter => {
    selectedFilterUuid = selectedFilter;
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
</style>

<CanvasWEBGL {imgPath} />
<div class="card">
  <div class="filters">
    <FilterList />
  </div>
</div>

<!-- {#if selectedFilterUuid} -->
<FilterOptionWindow />
<!-- {/if} -->
