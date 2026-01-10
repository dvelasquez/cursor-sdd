// Vue app entrypoint for PrimeVue configuration
import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';

export default (app: App) => {
  // Using unstyled mode for full Tailwind CSS control
  // PrimeVue components will have no default styling, allowing Tailwind utilities to work without conflicts
  app.use(PrimeVue, { unstyled: true });
};
