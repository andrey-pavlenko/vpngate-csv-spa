<script lang="ts">
  import { onMount } from 'svelte';
  import ClearableInput from './ClearableInput.svelte';

  let classes = '';
  export { classes as class };
  export let value = '';
  export let placeholder = '';

  onMount(() => {
    if (!value) {
      value = loadFilename() ?? '';
    }
  });

  const storageKey = 'vpn_config_filename';

  function loadFilename(): string | undefined {
    return localStorage.getItem(storageKey) || undefined;
  }

  function saveFilename(name: string) {
    localStorage.setItem(storageKey, name);
  }

  function handleChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      if (event.target.value) {
        saveFilename(event.target.value);
      }
    }
  }
</script>

<ClearableInput class={classes} bind:value {placeholder} onChange={handleChange} />
