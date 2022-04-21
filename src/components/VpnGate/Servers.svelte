<script lang="ts">
  import vgateStore from './store';
  import ServerRow from './ServerRow.svelte';
  import Sorter from './Sorter.svelte';

  export let downloadFileName = '';

  vgateStore.reload();
</script>

<section>
  {#if $vgateStore.isLoading}
    <div>Loading...</div>
  {:else if $vgateStore.error}
    <dir>Error: {$vgateStore.error}</dir>
  {:else}
    <Sorter class="mb-8" bind:servers={$vgateStore.servers} />
    <div class="max-w-4xl mx-auto">
      {#each $vgateStore.servers ?? [] as server}
        <ServerRow {server} {downloadFileName} />
      {:else}
        <div>empty</div>
      {/each}
    </div>
  {/if}
</section>
