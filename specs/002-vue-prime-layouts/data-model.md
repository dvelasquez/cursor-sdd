# Data Model: Vue Prime UI Library Integration and Standard Layouts

**Feature**: 002-vue-prime-layouts  
**Date**: 2026-01-10  
**Purpose**: Define data structures for layout configuration and mock authentication state

## Overview

This feature is UI-focused with mock data during development. The data model defines:
1. **Layout Configuration** - Structure and styling configuration for public/private layouts
2. **Mock User Session** - Simulated authentication state for UI development
3. **Navigation Structure** - Navigation item definitions for public and private layouts

**Note**: This phase uses mock/fixture data only. Actual authentication system and data persistence will be implemented in a separate feature.

## Entities

### 1. Layout Configuration

**Purpose**: Defines the structure and styling configuration for page layouts (public and private)

**Type**: TypeScript interface (configuration object)

**Attributes**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `type` | `'public' \| 'private'` | Yes | Layout type identifier | Must be one of: 'public', 'private' |
| `header` | `HeaderConfig` | Yes | Header configuration | Must include navigation structure |
| `footer` | `FooterConfig` | Optional | Footer configuration | Can be empty for minimal layouts |
| `responsiveBreakpoints` | `BreakpointConfig` | Yes | Responsive design breakpoints | Must support 320px-2560px width range |
| `theme` | `ThemeConfig` | Optional | Theme/styling configuration | Uses Tailwind CSS + PrimeVue plugin defaults if not specified |

**Sub-entities**:

#### HeaderConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `navigation` | `NavigationItem[]` | Yes | Array of navigation items |
| `showBranding` | `boolean` | Yes | Whether to display branding/logo |
| `authIndicators` | `AuthIndicatorConfig` | Conditional | Required for private layouts, not present in public |

#### NavigationItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Display text for navigation link |
| `href` | `string` | Yes | URL path or route |
| `icon` | `string` | Optional | Icon identifier (PrimeIcons class name) |

#### AuthIndicatorConfig (Private layouts only)

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `position` | `'header-top-right'` | Yes | Location of auth indicators | Must be 'header-top-right' per clarification |
| `showUsername` | `boolean` | Yes | Display username or email | Must display user identification |
| `showAvatar` | `boolean` | Yes | Display avatar or initial | Must include visual user representation |
| `showLogout` | `boolean` | Yes | Display logout button | Must be present for private layouts |

#### FooterConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | `string \| ReactNode` | Optional | Footer content (simple text or structured content) |
| `links` | `NavigationItem[]` | Optional | Footer navigation links |

#### BreakpointConfig

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `mobile` | `number` | Yes | Mobile breakpoint (max width) | Default: 640px (sm) |
| `tablet` | `number` | Yes | Tablet breakpoint (max width) | Default: 1024px (md) |
| `desktop` | `number` | Yes | Desktop breakpoint (min width) | Default: 1024px (lg) |
| `minWidth` | `number` | Yes | Minimum supported width | Must be 320px per SC-003 |
| `maxWidth` | `number` | Yes | Maximum supported width | Must be 2560px per SC-003 |

#### ThemeConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `preset` | `'Aura' \| 'Material' \| 'Lara' \| 'Nora'` | Optional | PrimeVue theme preset name |
| `mode` | `'styled' \| 'unstyled'` | Optional | Styled or unstyled mode (default: 'styled' with tailwindcss-primeui) |

**Relationships**:
- Layout Configuration → Navigation Items: One-to-many (one layout has multiple nav items)
- Layout Configuration → Auth Indicators: One-to-one (only for private layouts)

**State Transitions**: None (configuration is static during runtime)

**Validation Rules**:
- Public layout MUST NOT include `authIndicators` field
- Private layout MUST include `authIndicators` field with all required sub-fields
- Navigation items for public layout MUST include: home, about, login (per clarification)
- Navigation items for private layout MUST include: dashboard, profile, logout (per clarification)
- Breakpoint configuration MUST support responsive range 320px-2560px (SC-003)

---

### 2. Mock User Session

**Purpose**: Represents simulated authentication state data for UI development and layout testing

**Type**: TypeScript interface (mock data structure)

**Attributes**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | `string` | Yes | Unique user identifier | Must be non-empty string |
| `username` | `string` | Conditional | Username for display | Required if email not provided |
| `email` | `string` | Conditional | Email for display | Required if username not provided |
| `avatar` | `string \| null` | Optional | Avatar image URL | Can be null, fallback to initial |
| `initial` | `string` | Conditional | Initial letter(s) for avatar fallback | Required if avatar is null, typically first letter of username/email |
| `isAuthenticated` | `boolean` | Yes | Authentication state | Must be `true` for private layout testing |
| `sessionMetadata` | `SessionMetadata` | Optional | Additional session information | For testing various session states |

**Sub-entities**:

#### SessionMetadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `loginTime` | `Date \| string` | Optional | Session start timestamp |
| `expiresAt` | `Date \| string` | Optional | Session expiration timestamp |
| `role` | `string` | Optional | User role (for future role-based features) |

**Relationships**:
- Mock User Session → Layout Configuration: Used by private layouts to display user information

**State Transitions**:
- `isAuthenticated: false` → `isAuthenticated: true` (login simulation)
- `isAuthenticated: true` → `isAuthenticated: false` (logout simulation)

**Validation Rules**:
- At least one of `username` or `email` MUST be provided (per FR-004)
- If `avatar` is null, `initial` MUST be provided (fallback requirement)
- `initial` should typically be 1-2 characters (first letter of username/email)
- For private layout testing, `isAuthenticated` MUST be `true`
- Mock sessions are for development only, no persistence required (per spec assumptions)

**Example Mock Data**:

```typescript
{
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
}
```

---

### 3. Component Integration

**Purpose**: Represents the relationship between PrimeVue components, Astro components, and layout structures

**Type**: TypeScript type (composition pattern, not a data entity)

**Attributes**: This is not a data entity but a composition pattern:

| Component Type | Location | Description |
|----------------|----------|-------------|
| `PrimeVueComponent` | `src/components/vue/*.vue` | Vue components using PrimeVue library |
| `AstroLayout` | `src/layouts/*.astro` | Astro layout components (PublicLayout, PrivateLayout) |
| `AstroPage` | `src/pages/*.astro` | Astro page components (routes) |
| `AstroComponent` | `src/components/*.astro` | Reusable Astro components |

**Relationships**:
- Astro Page → Astro Layout: One-to-one (each page uses one layout)
- Astro Layout → Vue Components: One-to-many (layout can contain multiple Vue components)
- Vue Components → PrimeVue Components: One-to-many (wrappers or direct usage)
- Astro Components → Vue Components: Many-to-many (can be used together)

**Integration Rules**:
- Vue components MUST use `client:*` directives when used in Astro (per Astro architecture)
- PrimeVue components MUST be imported in Vue files, not directly in Astro files
- Layout components can mix Astro and Vue components as needed
- All components must be compatible with Tailwind CSS utility classes (per research.md)

---

## Type Definitions (TypeScript)

```typescript
// Layout Configuration Types
type LayoutType = 'public' | 'private';

interface NavigationItem {
  label: string;
  href: string;
  icon?: string; // PrimeIcons class name
}

interface AuthIndicatorConfig {
  position: 'header-top-right';
  showUsername: boolean;
  showAvatar: boolean;
  showLogout: boolean;
}

interface HeaderConfig {
  navigation: NavigationItem[];
  showBranding: boolean;
  authIndicators?: AuthIndicatorConfig; // Only for private layouts
}

interface FooterConfig {
  content?: string;
  links?: NavigationItem[];
}

interface BreakpointConfig {
  mobile: number; // max width
  tablet: number; // max width
  desktop: number; // min width
  minWidth: number; // 320px per SC-003
  maxWidth: number; // 2560px per SC-003
}

type ThemePreset = 'Aura' | 'Material' | 'Lara' | 'Nora';
type ThemeMode = 'styled' | 'unstyled';

interface ThemeConfig {
  preset?: ThemePreset;
  mode?: ThemeMode;
}

interface LayoutConfiguration {
  type: LayoutType;
  header: HeaderConfig;
  footer?: FooterConfig;
  responsiveBreakpoints: BreakpointConfig;
  theme?: ThemeConfig;
}

// Mock User Session Types
interface SessionMetadata {
  loginTime?: Date | string;
  expiresAt?: Date | string;
  role?: string;
}

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

---

## Data Flow

### Public Layout Flow

```
Page Request (Public Route)
  ↓
Astro Page Component
  ↓
PublicLayout.astro (Layout Configuration: type='public')
  ↓
  ├─ Header (Navigation: home, about, login)
  ├─ Main Content (Astro/Vue components)
  └─ Footer
```

### Private Layout Flow

```
Page Request (Private Route) + Mock Session Data
  ↓
Astro Page Component
  ↓
PrivateLayout.astro (Layout Configuration: type='private')
  ↓
  ├─ Header
  │   ├─ Navigation (dashboard, profile, logout)
  │   └─ Auth Indicators (UserProfile.vue component)
  │       ├─ Username/Email
  │       ├─ Avatar/Initial
  │       └─ Logout Button
  ├─ Main Content (Astro/Vue components)
  └─ Footer
```

---

## Constraints & Assumptions

1. **No Persistence**: All data structures are in-memory during this UI-only phase
2. **Mock Data Only**: MockUserSession is for development/testing, not production authentication
3. **Type Safety**: All structures use TypeScript interfaces with strict mode
4. **No Validation Runtime**: Validation rules are enforced at compile time and during development (no Zod validation needed at boundaries for this phase)
5. **Responsive Range**: Breakpoint configuration must support 320px-2560px width (SC-003)
6. **Layout Consistency**: Layout configurations must maintain visual consistency between public and private layouts (FR-006)

---

## Future Considerations

When authentication system is implemented:
- MockUserSession will be replaced with actual User entity
- Session management will include persistence and security
- Layout configuration may need to support dynamic user roles/permissions
- Validation rules will move to runtime with Zod at API boundaries

---

## References

- Feature Specification: [spec.md](./spec.md)
- Implementation Plan: [plan.md](./plan.md)
- Research: [research.md](./research.md)
- PrimeVue Components: https://primevue.org/
- Tailwind CSS Utilities: https://tailwindcss.com/
- Astro Components: https://docs.astro.build/en/core-concepts/astro-components/
