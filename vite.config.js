import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || '/produccion/',
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  }
});
