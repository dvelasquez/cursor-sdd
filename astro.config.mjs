// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

import db from '@astrojs/db';

import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [vue({ appEntrypoint: '/src/pages/_app' }), db(), clerk()],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'primevue/card',
        'primevue/button',
        'primevue/badge',
        'primevue/chip',
        'primevue/tag',
        'primevue/datatable',
        'primevue/column',
        'primevue/progressspinner',
        'primevue/message',
      ],
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
  output: 'server',
});
