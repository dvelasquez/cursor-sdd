// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [vue({ appEntrypoint: '/src/pages/_app' })],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['primevue/card', 'primevue/button', 'primevue/badge', 'primevue/chip', 'primevue/tag']
    }
  },

  adapter: node({
    mode: 'standalone'
  })
});