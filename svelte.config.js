import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      layout: { runbook: './src/lib/layouts/runbook.svelte' },
    }),
  ],
  kit: {
    adapter: adapter({ pages: 'build', strict: true }),
    alias: { '#lib': 'src/lib' },
    inlineStyleThreshold: 100000,
  },
};

export default config;
