# Contracts: Vue Prime UI Library Integration and Standard Layouts

**Feature**: 002-vue-prime-layouts  
**Date**: 2026-01-10  
**Purpose**: Define component interfaces and contracts for UI components

## Overview

This feature is **UI-only** with mock data during development. As such, there are **no API endpoints** requiring REST/GraphQL contracts. Instead, this directory contains:

1. **Component Interface Contracts** - TypeScript interfaces for Vue components and Astro layouts
2. **Mock Data Contracts** - Fixture data structures for development/testing
3. **Layout Configuration Contracts** - Type definitions for layout configuration objects

**Note**: When authentication system is implemented in a future feature, API contracts will be added to that feature's contracts directory.

---

## Component Interface Contracts

### Layout Components

#### `PublicLayout.astro`
- **Purpose**: Standard layout for public pages (landing, docs, marketing)
- **Props**: None (uses Astro slots for content)
- **Output**: HTML structure with header, navigation, main content area, footer
- **Navigation Items**: `home`, `about`, `login` (per spec clarification)

#### `PrivateLayout.astro`
- **Purpose**: Standard layout for authenticated pages
- **Props**: 
  - `userSession: MockUserSession` (mock data for UI development)
- **Output**: HTML structure with header (including auth indicators), navigation, main content area, footer
- **Navigation Items**: `dashboard`, `profile`, `logout` (per spec clarification)
- **Auth Indicators**: Username/email, avatar/initial, logout button (positioned top-right in header)

### Vue Components

#### `PublicNav.vue`
- **Purpose**: Navigation component for public layout
- **Props**:
  ```typescript
  interface PublicNavProps {
    items: NavigationItem[]; // home, about, login
    showBranding?: boolean;
  }
  ```
- **Emits**: `navigate` (route change event)
- **Client Directive**: `client:load` (hydrate on page load)

#### `PrivateNav.vue`
- **Purpose**: Navigation component for private layout
- **Props**:
  ```typescript
  interface PrivateNavProps {
    items: NavigationItem[]; // dashboard, profile, logout
    userSession: MockUserSession;
  }
  ```
- **Emits**: `navigate` (route change event), `logout` (logout action)
- **Client Directive**: `client:load` (hydrate on page load)

#### `UserProfile.vue`
- **Purpose**: Authentication state indicator component (username/email, avatar/initial, logout button)
- **Props**:
  ```typescript
  interface UserProfileProps {
    userSession: MockUserSession;
    position?: 'header-top-right'; // Default: 'header-top-right' per clarification
  }
  ```
- **Emits**: `logout` (logout action)
- **Client Directive**: `client:load` (hydrate on page load)
- **PrimeVue Components Used**: `Avatar`, `Button`, `Menu` (for dropdown if needed)

---

## Mock Data Contracts

### `MockUserSession` Interface

See [data-model.md](../data-model.md#2-mock-user-session) for complete definition.

**Location**: `src/lib/fixtures/mock-user-session.ts`

**Contract**:
```typescript
interface MockUserSession {
  id: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  initial?: string;
  isAuthenticated: boolean;
  sessionMetadata?: SessionMetadata;
}
```

**Validation Rules**:
- At least one of `username` or `email` MUST be provided
- If `avatar` is null, `initial` MUST be provided
- For private layout testing, `isAuthenticated` MUST be `true`

**Example Fixture**:
```typescript
export const mockUserSession: MockUserSession = {
  id: "mock-user-001",
  username: "johndoe",
  email: "john.doe@example.com",
  avatar: null,
  initial: "JD",
  isAuthenticated: true,
  sessionMetadata: {
    loginTime: "2026-01-10T10:00:00Z",
    role: "user"
  }
};
```

---

## Layout Configuration Contracts

### `LayoutConfiguration` Interface

See [data-model.md](../data-model.md#1-layout-configuration) for complete definition.

**Location**: `src/lib/types/layout-config.ts` (optional, can be inline in components)

**Contract**:
```typescript
type LayoutType = 'public' | 'private';

interface LayoutConfiguration {
  type: LayoutType;
  header: HeaderConfig;
  footer?: FooterConfig;
  responsiveBreakpoints: BreakpointConfig;
  theme?: ThemeConfig;
}
```

**Usage**: Layout configuration can be passed as props to layout components or defined within the layout component itself (static configuration).

---

## Component Integration Contracts

### Vue Component → Astro Component Usage

**Contract**: Vue components MUST be wrapped with Astro `client:*` directives when used in Astro pages/layouts.

**Pattern**:
```astro
---
import MyVueComponent from '../components/vue/MyComponent.vue';
import { mockUserSession } from '../lib/fixtures/mock-user-session';
---

<MyVueComponent client:load userSession={mockUserSession} />
```

**Directives**:
- `client:load` - Hydrate on page load (recommended for above-fold components)
- `client:idle` - Hydrate when browser is idle (for below-fold components)
- `client:visible` - Hydrate when component becomes visible (performance optimization)

### Astro Layout → Astro Page Usage

**Contract**: Astro pages MUST use one of the standard layout components (`PublicLayout` or `PrivateLayout`).

**Pattern**:
```astro
---
import PublicLayout from '../layouts/PublicLayout.astro';
---

<PublicLayout>
  <h1>Page Content</h1>
</PublicLayout>
```

---

## PrimeVue Component Contracts

### Import Pattern

**Contract**: PrimeVue components MUST be imported directly from `primevue/[component-name]`.

**Pattern**:
```typescript
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
```

### Styling Contract

**Contract**: PrimeVue components MUST use Tailwind CSS utilities via `tailwindcss-primeui` plugin.

**Pattern**:
```vue
<template>
  <Button 
    label="Click Me" 
    class="bg-primary hover:bg-primary-emphasis text-primary-contrast rounded-border"
  />
</template>
```

**Utilities Available** (from `tailwindcss-primeui`):
- Semantic colors: `bg-primary`, `text-surface-500`, `bg-primary-emphasis`
- Color palettes: `primary-[50-950]`, `surface-[0-950]`
- Theme utilities: `rounded-border`, `text-muted-color`, `bg-emphasis`

---

## No API Contracts

**Why No API Contracts?**
- This is a UI-only phase with mock data (per spec assumptions)
- No backend API endpoints are implemented or required
- Authentication system will be implemented in a separate feature
- All data structures are in-memory during this phase

**When API Contracts Will Be Added:**
- In future feature implementing authentication system
- When backend API endpoints are required
- API contracts will follow standard REST/GraphQL patterns as needed

---

## References

- Feature Specification: [../spec.md](../spec.md)
- Data Model: [../data-model.md](../data-model.md)
- Implementation Plan: [../plan.md](../plan.md)
- Research: [../research.md](../research.md)
- PrimeVue Components: https://primevue.org/
- Astro Component Directives: https://docs.astro.build/en/guides/client-side-scripts/
