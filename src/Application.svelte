<script lang="ts">
  import { DownloadFilename } from './components';
  import { VGateServers } from './components/VpnGate';

  let downloadFileName = '';
</script>

<main class="max-w-5xl mx-auto">
  <DownloadFilename
    class="mb-8"
    placeholder="Specify the name of the saved settings file"
    bind:value={downloadFileName}
  />
  <VGateServers bind:downloadFileName />
</main>
