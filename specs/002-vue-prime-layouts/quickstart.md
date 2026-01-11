# Quick Start Guide: Vue Prime UI Library Integration and Standard Layouts

**Feature**: 002-vue-prime-layouts  
**Date**: 2026-01-10  
**Purpose**: Developer guide for implementing PrimeVue integration and standard layouts

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js installed (compatible with Astro 5.16.8)
- ✅ Package manager: `pnpm` (or `npm`/`yarn`)
- ✅ Existing Astro project with:
  - `@astrojs/vue@5.1.4` ✅ (already installed)
  - `vue@3.5.26` ✅ (already installed)
  - `tailwindcss@4.1.18` ✅ (already installed)
  - `@tailwindcss/vite@4.1.18` ✅ (already installed)

**Verify prerequisites:**

```bash
cd /home/dan/dev/d13z/cursor-sdd
pnpm --version  # Should show pnpm version
node --version  # Should show Node.js version
cat package.json | grep -A 5 "dependencies"  # Check installed packages
```

---

## Step 1: Install Dependencies

Install PrimeVue, PrimeIcons, and the official Tailwind CSS integration plugin:

```bash
pnpm install primevue@4.5.4 primeicons tailwindcss-primeui
```

**Expected packages added:**

- `primevue@4.5.4` - PrimeVue component library
- `primeicons` - Icon library for PrimeVue components
- `tailwindcss-primeui` - Official PrimeVue + Tailwind CSS integration plugin

**Verify installation:**

```bash
pnpm list primevue primeicons tailwindcss-primeui
```

---

## Step 2: Configure Tailwind CSS Integration

Update `src/styles/global.css` to include the PrimeVue Tailwind plugin:

**Before:**

```css
/* src/styles/global.css */
/* Tailwind base styles */
```

**After:**

```css
/* src/styles/global.css */
@import 'tailwindcss';
@import 'tailwindcss-primeui';
```

**Note**: For Tailwind CSS v4, the plugin is imported directly in CSS (no `tailwind.config.js` needed). See [research.md](./research.md) for details.

---

## Step 3: Create Vue App Entrypoint

Create `src/pages/_app.ts` to configure PrimeVue globally:

```typescript
// src/pages/_app.ts
import { createApp, type App } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'; // PrimeVue theme preset
import 'primeicons/primeicons.css';

export default (app: App) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue',
        },
      },
    },
  });
};
```

**Install theme preset:**

```bash
pnpm install @primeuix/themes
```

**Alternative (Unstyled Mode):**
If you prefer unstyled mode with full Tailwind control:

```typescript
// src/pages/_app.ts
import { createApp, type App } from 'vue';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';

export default (app: App) => {
  app.use(PrimeVue, { unstyled: true });
};
```

---

## Step 4: Update Astro Configuration

Update `astro.config.mjs` to include the Vue app entrypoint:

**Before:**

```javascript
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  // ...
});
```

**After:**

```javascript
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue({ appEntrypoint: '/src/pages/_app' })],
  // ...
});
```

---

## Step 5: Create Project Structure

Create the necessary directories for components and fixtures:

```bash
# Create Vue components directory
mkdir -p src/components/vue

# Create mock data fixtures directory
mkdir -p src/lib/fixtures

# Create types directory (optional, if needed)
mkdir -p src/lib/types
```

**Project structure:**

```
src/
├── components/
│   ├── vue/              # NEW: Vue components using PrimeVue
│   │   ├── PublicNav.vue
│   │   ├── PrivateNav.vue
│   │   └── UserProfile.vue
│   └── ... (existing Astro components)
├── layouts/
│   ├── Layout.astro      # Existing base layout
│   ├── PublicLayout.astro    # NEW: Public page layout
│   └── PrivateLayout.astro   # NEW: Authenticated page layout
├── lib/
│   └── fixtures/         # NEW: Mock data for development
│       └── mock-user-session.ts
└── pages/
    ├── index.astro       # Existing: Homepage (to be enhanced)
    ├── about.astro       # NEW: Example public page
    └── dashboard/        # NEW: Example private pages
        └── index.astro
```

---

## Step 6: Create Mock Data Fixture

Create `src/lib/fixtures/mock-user-session.ts` for development/testing:

```typescript
// src/lib/fixtures/mock-user-session.ts
import type { MockUserSession } from '../../../contracts/types';

/**
 * Example mock user session for private layout testing
 * Per spec: Standard profile indicator set (username/email, avatar/initial, logout button)
 */
export const mockUserSession: MockUserSession = {
  id: 'mock-user-001',
  username: 'johndoe',
  email: 'john.doe@example.com',
  avatar: null,
  initial: 'JD',
  isAuthenticated: true,
  sessionMetadata: {
    loginTime: '2026-01-10T10:00:00Z',
    role: 'user',
  },
};

/**
 * Example unauthenticated state (for public layout testing)
 */
export const mockUnauthenticated: MockUserSession = {
  id: 'anonymous',
  isAuthenticated: false,
};
```

**Note**: For TypeScript types, import from contracts:

```typescript
import type { MockUserSession } from '../../specs/002-vue-prime-layouts/contracts/types';
```

---

## Step 7: Create Example Vue Component

Create a simple Vue component using PrimeVue to verify setup:

**`src/components/vue/Button.vue`:**

```vue
<script setup lang="ts">
import Button from 'primevue/button';

interface Props {
  label: string;
  className?: string;
}

defineProps<Props>();
</script>

<template>
  <Button
    :label="label"
    :class="
      className || 'bg-primary hover:bg-primary-emphasis text-primary-contrast rounded-border p-4'
    "
  />
</template>
```

**Use in Astro page (`src/pages/test.astro`):**

```astro
---
import MyButton from '../components/vue/Button.vue';
---

<MyButton client:load label="Click Me" />
```

---

## Step 8: Verify Setup

Run the development server and verify everything works:

```bash
# Start dev server
pnpm dev

# Open browser at http://localhost:4321
# Navigate to /test page
```

**Checklist:**

- ✅ Application starts without errors
- ✅ No console errors in browser
- ✅ PrimeVue button renders correctly
- ✅ Tailwind utilities work (`bg-primary`, `rounded-border`, etc.)
- ✅ PrimeIcons load (check network tab for `primeicons.css`)

**Troubleshooting:**

| Issue                                  | Solution                                                      |
| -------------------------------------- | ------------------------------------------------------------- |
| `Cannot find module 'primevue/button'` | Run `pnpm install primevue@4.5.4`                             |
| Tailwind utilities not working         | Verify `@import "tailwindcss-primeui";` in `global.css`       |
| PrimeVue theme not loading             | Verify `@primeuix/themes` installed and imported in `_app.ts` |
| Vue components not hydrating           | Ensure `client:load` directive is used in Astro               |

---

## Step 9: Implement Public Layout

Create `src/layouts/PublicLayout.astro`:

```astro
---
// src/layouts/PublicLayout.astro
import PublicNav from '../components/vue/PublicNav.vue';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>Public Page</title>
  </head>
  <body>
    <header>
      <PublicNav client:load />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>Footer content</p>
    </footer>
  </body>
</html>
```

**Navigation component (`src/components/vue/PublicNav.vue`):**

```vue
<script setup lang="ts">
import Menubar from 'primevue/menubar';
import { PUBLIC_NAV_ITEMS } from '../../specs/002-vue-prime-layouts/contracts/component-interfaces';

const items = PUBLIC_NAV_ITEMS.map((item) => ({
  label: item.label,
  icon: item.icon,
  command: () => {
    // Handle navigation (use Astro routing or client-side router)
    window.location.href = item.href;
  },
}));
</script>

<template>
  <Menubar :model="items" class="w-full" />
</template>
```

---

## Step 10: Implement Private Layout

Create `src/layouts/PrivateLayout.astro`:

```astro
---
// src/layouts/PrivateLayout.astro
import PrivateNav from '../components/vue/PrivateNav.vue';
import UserProfile from '../components/vue/UserProfile.vue';
import { mockUserSession } from '../lib/fixtures/mock-user-session';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>Private Page</title>
  </head>
  <body>
    <header class="flex items-center justify-between p-4">
      <PrivateNav client:load :userSession={mockUserSession} />
      <UserProfile client:load :userSession={mockUserSession} position="header-top-right" />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>Footer content</p>
    </footer>
  </body>
</html>
```

**UserProfile component (`src/components/vue/UserProfile.vue`):**

```vue
<script setup lang="ts">
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import type { UserProfileProps } from '../../specs/002-vue-prime-layouts/contracts/component-interfaces';

const props = defineProps<UserProfileProps>();

const emit = defineEmits<{
  logout: [];
}>();

const displayName = props.userSession.username || props.userSession.email || 'User';
const avatarUrl = props.userSession.avatar;
const initial = props.userSession.initial || displayName.charAt(0).toUpperCase();

function handleLogout() {
  emit('logout');
  // In real app, redirect to login page
  window.location.href = '/';
}
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-surface-700">{{ displayName }}</span>
    <Avatar
      v-if="avatarUrl"
      :image="avatarUrl"
      :label="initial"
      shape="circle"
      class="bg-primary text-primary-contrast"
    />
    <Avatar v-else :label="initial" shape="circle" class="bg-primary text-primary-contrast" />
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      @click="handleLogout"
      class="bg-primary-emphasis hover:bg-primary"
    />
  </div>
</template>
```

---

## Step 11: Create Example Pages

**Public page (`src/pages/about.astro`):**

```astro
---
import PublicLayout from '../layouts/PublicLayout.astro';
---

<PublicLayout>
  <h1>About Us</h1>
  <p>This is a public page using the standard public layout.</p>
</PublicLayout>
```

**Private page (`src/pages/dashboard/index.astro`):**

```astro
---
import PrivateLayout from '../layouts/PrivateLayout.astro';
---

<PrivateLayout>
  <h1>Dashboard</h1>
  <p>This is a private page using the standard private layout with authentication state.</p>
</PrivateLayout>
```

---

## Step 12: Progressive Testing (Per Constitution)

Follow progressive testing workflow per constitution:

### 1. Static Analysis

```bash
# Type checking
pnpm astro check

# Linting (if configured)
pnpm lint
```

### 2. Build Verification

```bash
# Build application
pnpm build

# Should complete without errors
```

### 3. Browser Loading Verification

```bash
# Start dev server
pnpm dev

# Open browser at http://localhost:4321
# Verify:
# - No console errors
# - No runtime errors
# - Components render correctly
```

### 4. End-to-End Validation

- ✅ Visit `/about` - Verify public layout renders correctly
- ✅ Visit `/dashboard` - Verify private layout renders with auth indicators
- ✅ Verify responsive behavior (320px-2560px width range)
- ✅ Verify navigation links work
- ✅ Verify logout button triggers logout event (mock behavior)

---

## Available PrimeVue Components

Common components you can use with `tailwindcss-primeui` utilities:

- **Form**: `InputText`, `Button`, `Select`, `Checkbox`, `RadioButton`, `Textarea`
- **Data**: `DataTable`, `Card`, `Panel`
- **Menu**: `Menubar`, `Menu`, `Breadcrumb`
- **Overlay**: `Dialog`, `Tooltip`, `Popover`
- **Media**: `Avatar`, `Image`, `Carousel`

**Import pattern:**

```vue
<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
</script>
```

**Styling with tailwindcss-primeui utilities:**

```vue
<template>
  <!-- Semantic theme colors -->
  <Button class="bg-primary text-primary-contrast" />

  <!-- Color palette utilities -->
  <Card class="bg-surface-50 border border-surface-200" />

  <!-- Theme utilities -->
  <div class="rounded-border p-4 bg-emphasis">Content</div>
</template>
```

See [PrimeVue Tailwind CSS documentation](https://primevue.org/tailwind/) for complete utility reference.

---

## Next Steps

1. **Review Contracts**: See [contracts/README.md](./contracts/README.md) for component interfaces
2. **Review Data Model**: See [data-model.md](./data-model.md) for entity definitions
3. **Review Research**: See [research.md](./research.md) for technical decisions
4. **Implementation Tasks**: See `tasks.md` (will be created by `/speckit.tasks` command)

**Recommended Implementation Order:**

1. ✅ Setup and configuration (Steps 1-6)
2. ✅ Verify basic PrimeVue component works (Step 7-8)
3. ⏳ Implement PublicLayout (Step 9)
4. ⏳ Implement PrivateLayout (Step 10)
5. ⏳ Create example pages (Step 11)
6. ⏳ Enhance homepage with PrimeVue components (User Story 3)

---

## Troubleshooting

### Common Issues

**Issue**: `@primeuix/themes` not found

```bash
pnpm install @primeuix/themes
```

**Issue**: TypeScript errors in contracts

```bash
# Verify TypeScript can resolve contract types
# Check tsconfig.json includes contract paths if needed
```

**Issue**: Tailwind utilities from plugin not working

```bash
# Verify @import "tailwindcss-primeui"; is after @import "tailwindcss";
# Restart dev server after CSS changes
```

**Issue**: PrimeVue components not rendering

```bash
# Verify _app.ts is correctly configured
# Check browser console for Vue errors
# Ensure client:load directive is used in Astro
```

---

## References

- **Feature Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Research & Decisions**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/README.md](./contracts/README.md)
- **PrimeVue Docs**: https://primevue.org/
- **PrimeVue + Tailwind**: https://primevue.org/tailwind/
- **Astro Vue Integration**: https://docs.astro.build/en/guides/integrations-guide/vue/

---

## Support

For issues or questions:

1. Check [research.md](./research.md) for technical decisions
2. Review [contracts/README.md](./contracts/README.md) for component interfaces
3. Verify setup against this quickstart guide
4. Consult PrimeVue documentation: https://primevue.org/

---

**Last Updated**: 2026-01-10  
**Feature Status**: Planning Complete - Ready for Implementation
