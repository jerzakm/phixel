<script>
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
    console.log(list);
    for (const filter of list) {
      fList.push(filter.value);
    }
    tempProject.filters = fList;
    console.log(tempProject);
    currentProject.set(tempProject);
  }

  // $: list && currentProject.set(list) && console.log("changed filter list");
  $: list && updateFilters();
</script>

<style>
  .filters {
    list-style-type: none;
  }
  .filter-container {
    margin: 5px;
    background-color: #eeeeee;
  }
</style>

<Sortable {options} bind:list>
  {#each list as filter (filter.name)}
    <li
      animate:flip={{ duration: 150, easing: sineIn }}
      sortable-id={filter.name}
      class="filters">
      <div class="filter-container">{filter.name}</div>
    </li>
  {/each}
</Sortable>
