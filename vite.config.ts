import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    hmr: true
  },
  plugins: [svelte()]
});
