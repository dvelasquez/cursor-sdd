# Research: PrimeVue Integration with Astro + Vue 3

**Feature**: 002-vue-prime-layouts  
**Date**: 2026-01-10  
**Purpose**: Resolve technical clarifications for PrimeVue integration, installation method, and configuration approach

## Research Questions

1. **PrimeVue Installation**: What is the recommended PrimeVue version and installation method for Astro + Vue 3 projects?
2. **PrimeVue Configuration**: How to configure PrimeVue with Astro's Vue integration?
3. **Tailwind CSS Integration**: How to integrate PrimeVue with existing Tailwind CSS v4 setup?
4. **Styling Approach**: Should we use PrimeVue themes or unstyled mode with Tailwind CSS?

## Findings

### 1. PrimeVue Version & Installation

**Decision**: Install PrimeVue 4.5.4 (latest as of January 2026) with PrimeIcons

**Rationale**:
- PrimeVue 4.5.4 is the latest stable version as of January 2026
- Fully compatible with Vue 3 (project uses Vue 3.5.26)
- PrimeVue 4 introduced design token-based theming API for better customization
- PrimeVue has transitioned from PrimeFlex to recommending Tailwind CSS for styling

**Installation Commands**:
```bash
pnpm install primevue@4.5.4 primeicons
pnpm install tailwindcss-primeui
```

**Alternatives Considered**:
- PrimeVue 3.x: Older version, lacks design token system
- Other Vue component libraries (Vuetify, Quasar): Not aligned with constitution stack choice

### 2. Astro + Vue Integration Configuration

**Decision**: Use Astro Vue integration with app entrypoint for PrimeVue configuration

**Rationale**:
- Astro's `@astrojs/vue` integration (already installed v5.1.4) supports app entrypoints
- App entrypoint allows global PrimeVue configuration before components render
- Standard pattern for framework-specific setup in Astro

**Configuration Approach**:
1. Create `src/pages/_app.ts` (or `.js`) as Vue app entrypoint
2. Configure PrimeVue plugin with unstyled mode (see styling approach below)
3. Update `astro.config.mjs` to reference the entrypoint:
   ```javascript
   integrations: [vue({ appEntrypoint: '/src/pages/_app' })]
   ```

**Entrypoint Structure** (styled mode with Tailwind):
```typescript
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'; // Or other theme preset
import 'primeicons/primeicons.css';

export default (app: App) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue'
        }
      }
    }
  });
};
```

**Entrypoint Structure** (unstyled mode - alternative):
```typescript
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';

export default (app: App) => {
  app.use(PrimeVue, { unstyled: true });
};
```

**Alternatives Considered**:
- Per-component configuration: Not scalable, requires repetition
- Global CSS import without entrypoint: Doesn't allow plugin configuration
- Separate Vue app file: More complex, not standard Astro pattern

### 3. Tailwind CSS v4 Integration

**Decision**: Use official `tailwindcss-primeui` plugin for first-class PrimeVue + Tailwind CSS v4 integration

**Rationale**:
- Project already uses Tailwind CSS v4.1.18 via `@tailwindcss/vite` plugin
- PrimeVue provides official `tailwindcss-primeui` plugin for seamless integration (per https://primevue.org/tailwind/)
- Plugin works in both styled and unstyled modes
- Provides extended utilities derived from PrimeVue theme (e.g., `bg-primary`, `text-surface-500`, `rounded-border`)
- Prevents CSS conflicts with proper CSS layer ordering
- Official, maintained integration ensures compatibility and best practices

**Configuration for Tailwind v4**:
1. Install plugin: `pnpm install tailwindcss-primeui`
2. In `src/styles/global.css`, add the import after Tailwind:
   ```css
   @import "tailwindcss";
   @import "tailwindcss-primeui";
   ```
3. Configure PrimeVue with CSS layer support (for styled mode):
   - CSS layer name: `primevue`
   - Order: `theme, base, primevue` (ensures Tailwind utilities can override)

**Styling Approaches**:

**Option A - Styled Mode (Recommended)**:
- Use PrimeVue theme presets (Aura, Material, Lara, Nora) with `tailwindcss-primeui` utilities
- Theme provides semantic colors accessible via Tailwind utilities (`bg-primary`, `text-surface-500`, etc.)
- Best of both worlds: PrimeVue's design system + Tailwind's utility-first approach

**Option B - Unstyled Mode**:
- Use PrimeVue with `{ unstyled: true }` and style entirely with Tailwind utilities
- More control but requires more custom styling work
- Useful for complete design system customization

**Styling Pattern (Styled Mode with Plugin)**:
```vue
<script setup>
import Button from 'primevue/button';
</script>

<template>
  <!-- Using PrimeVue theme utilities from tailwindcss-primeui plugin -->
  <Button 
    label="Click Me" 
    class="bg-primary hover:bg-primary-emphasis text-primary-contrast rounded-border p-4"
  />
</template>
```

**Alternatives Considered**:
- Pure unstyled mode without plugin: Loses benefits of theme integration and extended utilities
- PrimeFlex (PrimeVue's old utility library): Deprecated, PrimeVue now recommends Tailwind CSS
- Custom CSS for components: Defeats purpose of utility-first approach, harder to maintain

### 4. Component Usage in Astro

**Decision**: Use PrimeVue components in Vue components with client-side hydration directives

**Rationale**:
- PrimeVue components require Vue runtime (not server-rendered)
- Astro requires `client:*` directives for interactive Vue components
- Components imported in Vue files, then used in Astro pages via slots

**Usage Pattern**:

In Vue component (`src/components/vue/Button.vue`):
```vue
<script setup>
import Button from 'primevue/button';
</script>

<template>
  <Button :label="label" :class="className" />
</template>
```

In Astro page:
```astro
---
import MyButton from '../components/vue/Button.vue';
---

<MyButton client:load label="Click Me" className="..." />
```

**Directives**:
- `client:load` - Hydrate on page load (recommended for above-fold components)
- `client:idle` - Hydrate when browser is idle (for below-fold components)
- `client:visible` - Hydrate when component becomes visible (performance optimization)

**Alternatives Considered**:
- Direct PrimeVue import in Astro: Not supported, requires Vue context
- Server-side rendering only: Not possible, PrimeVue needs Vue runtime
- Full-page Vue SPA: Defeats Astro's static generation benefits

## Technical Specifications

### Package Versions
- **primevue**: `4.5.4` (latest stable, Vue 3 compatible)
- **primeicons**: Latest version (icon library, compatible with PrimeVue 4.x)
- **tailwindcss-primeui**: Latest version (official PrimeVue + Tailwind integration plugin)

### Dependencies Status
- ✅ `@astrojs/vue@5.1.4` - Already installed
- ✅ `vue@3.5.26` - Already installed, compatible
- ✅ `tailwindcss@4.1.18` - Already installed, will use with `tailwindcss-primeui` plugin
- ➕ `primevue@4.5.4` - To be installed
- ➕ `primeicons` - To be installed
- ➕ `tailwindcss-primeui` - To be installed (official integration plugin)

### Configuration Files to Modify
1. **package.json**: Add primevue, primeicons, and tailwindcss-primeui dependencies
2. **astro.config.mjs**: Add app entrypoint to Vue integration
3. **src/pages/_app.ts**: Create new file for PrimeVue configuration (styled or unstyled mode)
4. **src/styles/global.css**: Add `@import "tailwindcss-primeui";` after Tailwind import

## Implementation Notes

1. **tailwindcss-primeui Plugin Benefits**:
   - Official first-class integration between PrimeVue and Tailwind CSS
   - Extended utilities derived from PrimeVue theme (`bg-primary`, `text-surface-500`, etc.)
   - Works in both styled and unstyled modes
   - Proper CSS layer ordering prevents specificity conflicts
   - Semantic color palette utilities (`primary-[50-950]`, `surface-[0-950]`)
   - Supports all Tailwind variants and breakpoints (e.g., `dark:sm:hover:bg-primary`)

2. **Component Import Strategy**:
   - Import components directly from `primevue/[component-name]`
   - Example: `import Button from 'primevue/button'`
   - Tree-shaking will remove unused components

3. **TypeScript Support**:
   - PrimeVue 4.x includes TypeScript definitions
   - No additional `@types` package needed
   - Works with project's TypeScript strict mode

4. **Performance Considerations**:
   - Use appropriate `client:*` directives for hydration
   - Import only needed PrimeVue components
   - PrimeIcons CSS is lightweight (<50KB)

## Remaining Questions

None - All clarifications resolved. Ready to proceed with Phase 1 design.

## References

- PrimeVue Official Documentation: https://primevue.org/
- PrimeVue Tailwind CSS Integration (Official): https://primevue.org/tailwind/
- Astro Vue Integration Guide: https://docs.astro.build/en/guides/integrations-guide/vue/
- PrimeVue Configuration: https://primevue.org/configuration/
- PrimeVue Theming: https://primevue.org/theming/
