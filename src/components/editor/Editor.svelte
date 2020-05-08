<script>
  import Canvas from "./Canvas.svelte";
  import FilterList from "./FilterList.svelte";
  import Layers from "./Layers.svelte";
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
  /* .layers {
    background-color: #cecece;
    width: 150px;
  } */
  .filters {
    background-color: #dddddd;
    width: 100%;
    padding: 5px;
  }
</style>

<Canvas />
<div class="card">
  <div class="filters">
    <FilterList />
  </div>
  <!-- <div class="layers">
    <Layers />
  </div> -->
</div>
