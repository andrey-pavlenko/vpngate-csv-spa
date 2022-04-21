<script lang="ts">
  import className from 'classnames';
  import type { VGateServer } from './store';

  let classes = '';
  export { classes as class };
  export let servers: VGateServer[] = [];

  const keys = [
    { name: 'score', value: 'number' },
    { name: 'host', value: 'string' },
    { name: 'ip', value: 'string' },
    { name: 'ping', value: 'number' },
    { name: 'speed', value: 'number' },
    { name: 'country', value: 'string' },
    // { name: 'flag', value: 'string' },
    { name: 'sessions', value: 'number' },
    { name: 'uptime', value: 'number' },
    { name: 'users', value: 'number' },
    { name: 'traffic', value: 'number' },
    { name: 'logs', value: 'string' }
    // { name: 'operator', value: 'string' },
    // { name: 'message', value: 'string' },
    // { name: 'configBase64', value: 'string' }
  ];

  const sorting = {
    key: keys[0],
    desc: true
  };

  function sortServers({ key, desc }: typeof sorting): typeof servers {
    switch (key.value) {
      case 'number': {
        const sortFn = desc
          ? (a, b) => b[key.name] - a[key.name]
          : (a, b) => a[key.name] - b[key.name];
        return servers.sort(sortFn);
      }
      case 'string': {
        const sortFn = desc
          ? (a, b) => (b[key.name] as string).localeCompare(a[key.name])
          : (a, b) => (a[key.name] as string).localeCompare(b[key.name]);
        return servers.sort(sortFn);
      }
    }
    return servers;
  }

  $: servers = sortServers(sorting);
</script>

<div class={className('flex flex-wrap gap-x-4 gap-y-2 justify-center', classes)}>
  <label class="inline-flex flex-wrap gap-2 items-center">
    <span>Sort by</span>
    <select class="input-outline" bind:value={sorting.key}>
      {#each keys as k}
        <option value={k}>{k.name}</option>
      {/each}
    </select>
  </label>
  <label class="inline-flex flex-wrap gap-2 items-center">
    <input type="checkbox" bind:checked={sorting.desc} />
    <span>descending order</span>
  </label>
</div>
