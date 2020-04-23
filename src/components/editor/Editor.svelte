<script>
  import Canvas from "./Canvas.svelte";
  import Filters from "./Filters.svelte";
  import Layers from "./Layers.svelte";
</script>

<style>
  .card {
    background-color: #ffffff;
    min-height: 50px;
    width: 500px;
    position: fixed;
    top: 96px;
    right: 32px;
    display: flex;
    flex-direction: row;
  }
  .layers {
    background-color: #cecece;
    width: 150px;
  }
  .filters {
    background-color: #dddddd;
    width: 100%;
  }
</style>

<Canvas />
<div class="card">
  <div class="filters">
    <Filters />
  </div>
  <div class="layers">
    <Layers />
  </div>
</div>
