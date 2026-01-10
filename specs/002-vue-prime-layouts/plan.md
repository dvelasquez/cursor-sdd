# Implementation Plan: Vue Prime UI Library Integration and Standard Layouts

**Branch**: `002-vue-prime-layouts` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-vue-prime-layouts/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Integrate PrimeVue component library into the Astro + Vue.js project and create standardized layout structures for public pages (landing, docs) and authenticated private pages, with enhanced homepage demonstrating modern UI components.

**Technical Approach**: Install and configure PrimeVue for Vue 3 within Astro framework, create reusable layout components (public and private) using Astro layouts combined with Vue components, integrate PrimeVue UI components on homepage, and establish mock data fixtures for authentication state during UI development phase.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
  
  NOTE: Technology stack is defined in constitution (.specify/memory/constitution.md):
  - Language: JavaScript/TypeScript
  - Runtime: Node.js
  - Framework: Astro
  - UI Components: Vue.js (Vue 3)
  - Styling: Tailwind CSS
  - Component Library: PrimeVue
-->

**Language/Version**: JavaScript/TypeScript (TypeScript with strict mode, per constitution)  
**Runtime**: Node.js (per constitution)  
**Framework**: Astro 5.16.8 (per constitution and current package.json)  
**UI Components**: Vue.js 3.5.26 (Vue 3 composition API, per constitution and current package.json)  
**Component Library**: PrimeVue 4.5.4 (per constitution, latest stable as of Jan 2026) - resolved in research.md  
**Styling**: Tailwind CSS 4.1.18 (per constitution and current package.json) + PrimeVue via `tailwindcss-primeui` official plugin (per research.md)  
**Storage**: N/A (UI-only phase with mock data, no persistence required)  
**Testing**: Progressive E2E validation (per constitution): static analysis, browser loading verification, end-to-end user journey testing  
**Target Platform**: Web browsers (modern browsers - last 2 major versions of Chrome, Firefox, Safari, Edge, per spec assumptions)  
**Project Type**: Web application (Astro framework with SSR/hydration, per constitution)  
**Performance Goals**: <2s page load (homepage SC-004), <1s authentication state visibility (private pages SC-002), <100ms interactive feedback (SC-006)  
**Constraints**: Responsive design 320px-2560px width (SC-003), mock data only (no authentication system), no accessibility requirements this phase  
**Scale/Scope**: Development team use (SC-007: <5 min per page type creation), UI layout foundation for future features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all constitution principles:

- **Type Safety**: ✅ All code will use TypeScript with strict mode. Runtime validation (Zod) only at boundaries if needed (none required for UI-only phase with mock data).
- **Code Quality**: ✅ Linting and type checking will pass before any commit. ESLint and Prettier configurations enforced.
- **Testing Discipline**: ✅ Progressive testing workflow MUST be followed:
  - Static analysis (lint, typecheck) passes using `astro check` or `tsc --noEmit`
  - Application loads in browser without errors after each change (`npm run dev` and manual verification)
  - For PrimeVue integration: verify installation → test component rendering → verify layout integration → refine styling
  - Complete end-to-end validation in running application: visit public pages, visit private pages with mock auth, test homepage interactions, verify responsive behavior
- **Incremental Delivery**: ✅ Features broken into independently testable increments:
  - User Story 1 (P1): Public layout - independently testable
  - User Story 2 (P2): Private layout - depends on US1, independently testable with mock auth
  - User Story 3 (P3): Homepage enhancement - depends on US1, independently testable
- **Technology Stack Compliance**: ✅ Using constitution-defined stack:
  - TypeScript/JavaScript ✅
  - Node.js runtime ✅
  - Astro framework ✅ (already configured)
  - Vue.js 3 composition API ✅ (already configured)
  - Tailwind CSS ✅ (already configured)
  - PrimeVue component library ✅ (PrimeVue 4.5.4 - resolved in research.md)
- **Vue Component Patterns**: ✅ Vue components will follow Vue 3 composition API patterns
- **Styling Approach**: ✅ Styling uses Tailwind CSS utility classes; PrimeVue components used for complex UI elements (buttons, navigation, cards, etc.)

**Gate Status**: ✅ PASS - All constitution principles satisfied. No violations detected. Phase 0 research complete - see research.md.

## Project Structure

### Documentation (this feature)

```text
specs/002-vue-prime-layouts/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (/speckit.specify command output)
├── research.md          # Phase 0 output (/speckit.plan command) - ✅ CREATED
├── data-model.md        # Phase 1 output (/speckit.plan command) - ✅ CREATED
├── quickstart.md        # Phase 1 output (/speckit.plan command) - ✅ CREATED
├── contracts/           # Phase 1 output (/speckit.plan command) - ✅ CREATED
│   ├── README.md        # Contracts documentation
│   ├── component-interfaces.ts  # Component props/types
│   ├── types.ts         # Mock data types
│   └── types.d.ts       # TypeScript declarations
├── checklists/          # Existing: quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command) - ✅ CREATED
```

### Source Code (repository root)

```text
src/
├── assets/              # Existing: static assets (images, icons, etc.)
├── components/          # Existing + New: Astro and Vue components
│   ├── Welcome.astro   # Existing: example Astro component
│   ├── vue/            # NEW: Vue components (PrimeVue-based)
│   │   ├── PublicNav.vue
│   │   ├── PrivateNav.vue
│   │   ├── UserProfile.vue
│   │   └── ... (other Vue components using PrimeVue)
│   └── ...             # Future: additional shared components
├── layouts/             # Existing + New: Astro layout components
│   ├── Layout.astro    # Existing: base layout (may be refactored)
│   ├── PublicLayout.astro  # NEW: Standard public page layout
│   └── PrivateLayout.astro # NEW: Standard authenticated page layout
├── pages/               # Existing + New: Astro pages (routes)
│   ├── index.astro     # Existing: homepage (to be enhanced)
│   ├── about.astro     # NEW: example public page
│   ├── docs/           # NEW: example docs pages (public)
│   │   └── ...
│   └── dashboard/      # NEW: example private pages (authenticated)
│       └── ...
├── lib/                 # NEW: utilities and mock data fixtures
│   ├── fixtures/       # NEW: mock data for UI development
│   │   └── mock-user-session.ts
│   └── ...             # Future: utility functions
└── styles/              # Existing: global styles
    └── global.css      # Existing: global CSS (Tailwind integration)
```

**Structure Decision**: Single Astro project structure (Option 1 - DEFAULT). The project is a web application using Astro's file-based routing with:
- **Astro layouts** (`src/layouts/`) for page-level structure (public vs private)
- **Vue components** (`src/components/vue/`) for interactive PrimeVue components
- **Astro pages** (`src/pages/`) for routes with file-based routing
- **Mock fixtures** (`src/lib/fixtures/`) for development-time authentication state simulation
- **No backend/API separation** required for this UI-only phase (mock data only)
- **No test directory structure** needed - progressive E2E validation per constitution (browser testing)

**New Directories to Create**:
- `src/components/vue/` - Vue components using PrimeVue
- `src/lib/fixtures/` - Mock data fixtures
- Additional layout files in `src/layouts/`
- Example pages in `src/pages/` for demonstration

**Existing Directories to Modify**:
- `src/layouts/Layout.astro` - May refactor or keep as base
- `src/pages/index.astro` - Enhanced with PrimeVue components (User Story 3)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A - No constitution violations detected |
