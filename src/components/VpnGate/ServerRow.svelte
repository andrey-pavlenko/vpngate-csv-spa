<script lang="ts">
  import className from 'classnames';
  import { formatters } from '../../utils';
  import type { VGateServer } from './store';

  let classes = '';
  export { classes as class };
  export let server: VGateServer;
  export let downloadFileName = '';

  const downloadFileExtension = '.ovpn';

  const _classes = {
    label: 'text-xs text-gray-600',
    wrap_flex: 'flex items-center flex-wrap gap-x-2'
  };

  function hadleDowndloadClick() {
    const config = atob(server.configBase64 || '');
    const fileNamme = downloadFileName || server.host + downloadFileExtension;

    const blob = new Blob([config], {
      type: 'application/x-binary'
    });
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = URL.createObjectURL(blob);
    a.setAttribute('download', fileNamme);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
</script>

<div
  class={className('grid grid-cols-[minmax(8ch,1fr)_3fr_auto] gap-2 odd:bg-gray-100 py-2', classes)}
>
  <div>
    <div class="text-center sm:flex items-center flex-wrap gap-x-2 justify-center">
      <div class={_classes.label}>Score:</div>
      <div class="font-bold">{formatters.compactNum(server.score)}</div>
    </div>
  </div>
  <div class="md:grid grid-cols-[0.75fr_1fr] gap-2">
    <div class="mb-2">
      <div>{server.ip}</div>
      <div class="{_classes.label} {_classes.wrap_flex}">
        <div>{server.host}</div>
        <div>
          <div>Logging policy: {server.logs}</div>
        </div>
      </div>
      <div class="leading-3">
        <span class="text-xl">{server.flag}</span>
        <span class="text-xs">{server.country}</span>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <div>
        <div class="{_classes.wrap_flex} font-bold leading-5 mb-1">
          <div>
            {server.sessions > 1000
              ? formatters.compactNum(server.sessions)
              : server.sessions.toLocaleString()}
          </div>
          <div>sessions</div>
        </div>
        <div class="{_classes.label} {_classes.wrap_flex} gap-x-1 mb-1">
          <div>Uptime:</div>
          <div class="font-bold">{formatters.compactUptime(server.uptime)}</div>
        </div>
        <div class="{_classes.label} {_classes.wrap_flex} gap-x-1">
          <div>Total:</div>
          <div class="font-bold">{formatters.compactNum(server.users)} users</div>
        </div>
      </div>
      <div>
        <div class={_classes.wrap_flex}>
          <div class={_classes.label}>Speed:</div>
          <div class="font-bold">
            {formatters.compactNum(server.speed, {
              k: ' Kbps',
              m: ' Mbps',
              g: ' Gbps',
              t: ' Tbps'
            })}
          </div>
        </div>
        <div class="{_classes.wrap_flex} {_classes.label} gap-x-1 mb-1">
          <div>Ping:</div>
          <div class="font-bold">{server.ping} ms</div>
        </div>
        <div class="{_classes.wrap_flex} {_classes.label} gap-x-1">
          <div>Total traffic:</div>
          <div class="font-bold">
            {formatters.compactNum(server.traffic, {
              k: ' KB',
              m: ' MB',
              g: ' GB',
              t: ' TB'
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="px-2">
    <svg
      role="button"
      class={className(
        'h-8 w-10 md:h-10 mx-auto',
        { 'text-blue-600 cursor-pointer': server.configBase64.length > 0 },
        { 'text-gray-400 cursor-not-allowed': server.configBase64.length === 0 }
      )}
      on:click={hadleDowndloadClick}
    >
      <use href="./icons.svg#download" />
    </svg>
  </div>
</div>
