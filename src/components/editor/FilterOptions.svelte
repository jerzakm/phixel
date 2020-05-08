<script>
  export let filter;

  $: filter && console.log(filter);
</script>

<style>
  .filter-options {
    width: 100%;
    min-height: 100px;
    background-color: rgb(192, 192, 192);
  }
</style>

{#if filter.value.optionsOpen}
  <div class="filter-options" />
{/if}
