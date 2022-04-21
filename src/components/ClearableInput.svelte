<script lang="ts">
  import classNames from 'classnames';

  let classes = '';
  export { classes as class };
  export let value = '';
  export let placeholder = '';
  export let onChange: (e: Event) => void = () => {};

  let clearable = false;
  $: clearable = value.length > 0;

  let input: HTMLInputElement;

  function handleClear() {
    value = '';
    input.focus();
  }
</script>

<div class={classNames('relative', classes)}>
  <input
    class="input-outline w-full pr-10"
    type="text"
    {placeholder}
    bind:value
    bind:this={input}
    on:change={onChange}
  />
  <svg
    role="button"
    class="absolute right-1 top-0 h-full aspect-square {classNames({
      'cursor-default pointer-events-none text-gray-400': !clearable,
      'cursor-pointer pointer-events-auto': clearable
    })}"
    on:click={handleClear}
  >
    <use href="/icons.svg#clear-inverse" />
  </svg>
</div>
