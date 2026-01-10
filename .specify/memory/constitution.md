<!--
Sync Impact Report:
Version change: 1.1.0 → 1.2.0 (MINOR: new technology stack section added)
Modified principles: None
Added sections: Technology Stack (explicit technology choices: JS/TS, Node.js, Astro, Vue.js, Tailwind CSS, PrimeVue)
Removed sections: None
Templates updated:
  ✅ plan-template.md - Updated Technical Context section to reference technology stack from constitution, includes note about constitution-defined stack
  ✅ spec-template.md - No changes needed (technology agnostic)
  ✅ tasks-template.md - No changes needed (technology agnostic, but tasks should use constitution stack)
Follow-up: None - all templates remain compatible and aligned with technology stack
-->

# SpecIt Constitution

## Core Principles

### I. Type Safety & Static Analysis
Code MUST pass type checking before integration. TypeScript strict mode is required. All public APIs MUST have explicit type definitions. Runtime validation (via Zod or similar) is used at system boundaries only; domain logic uses pure TypeScript interfaces.

### II. Code Quality Gates
All code MUST pass linting and formatting checks before commit. ESLint and Prettier configurations are enforced. Code reviews MUST verify lint/type compliance in addition to functional correctness.

### III. Observable & Testable Design
Functions with >2 parameters MUST use named object parameters (RO-RO pattern). Async operations MUST use `Promise.allSettled` for parallel I/O; rejected results MUST be logged or returned in a `partialErrors` array. Errors are for panic states; anticipated failures return typed Result objects or null.

### IV. Progressive Testing Discipline (NON-NEGOTIABLE)
Every change MUST be validated end-to-end through progressive testing. The testing workflow is mandatory and sequential:

1. **Static Analysis**: Run linting and type checking tools to ensure code quality standards are met.
2. **Integration Validation**: After implementing any component, integration, or feature:
   - Start the application locally
   - Load the affected pages/routes in a browser
   - Verify no console errors, runtime errors, or visible breakages
   - Confirm the feature functions as intended in the live environment
3. **Progressive Integration Testing**: When adding new infrastructure (e.g., database, external service):
   - **Step 1**: Verify connection/initialization succeeds (connection test, health check)
   - **Step 2**: Add minimal dummy/test data to validate data flow
   - **Step 3**: Display data in UI (even as raw JSON string initially) to confirm end-to-end pipeline
   - **Step 4**: Refine presentation only after confirming data flow works correctly
   - Each step MUST be validated before proceeding to the next
4. **End-to-End Verification**: Complete user journeys MUST be tested in the running application after any feature addition or modification. This includes loading pages, interacting with forms, verifying data persistence, and checking error states.

**Rationale**: Early validation catches integration issues before they compound. Progressive testing ensures each layer works before adding complexity. Visual verification in the browser catches issues that static analysis and unit tests miss, especially for web applications where rendering, routing, and client-server interactions are critical.

### V. Incremental Delivery
Features MUST be delivered as independently testable increments. Each increment MUST be functional and demonstrable on its own. Complex features are broken into smaller stories that can each be validated end-to-end before integration.

## Technology Stack

The project uses the following technologies. Deviations require explicit justification in Complexity Tracking:

- **Language**: JavaScript/TypeScript (TypeScript preferred for type safety)
- **Runtime**: Node.js
- **Framework**: Astro (web framework with component islands architecture)
- **UI Components**: Vue.js (Vue 3 composition API)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Component Library**: PrimeVue (Vue.js component library, integrates with Tailwind CSS)

**Rationale**: This stack provides type safety (TypeScript), server-side rendering with client hydration (Astro), reactive UI components (Vue.js), rapid styling (Tailwind CSS), and pre-built accessible components (PrimeVue). The combination enables fast development while maintaining code quality and user experience standards.

All new features MUST use these technologies unless explicitly justified as exceptions. When selecting new dependencies, prefer packages that align with this stack (Vue 3 compatible, TypeScript support, Tailwind CSS integration).

## Development Workflow

All PRs and feature branches MUST demonstrate compliance with testing discipline:
- Type checking passes (`astro check` or `tsc --noEmit`)
- Linting passes (`eslint .` or equivalent)
- Application builds successfully (`npm run build` or `astro build`)
- Application runs without errors (`npm run dev` and manual verification)
- New features are verified in the browser with no console errors
- Vue components follow Vue 3 composition API patterns
- Styling uses Tailwind CSS utility classes; PrimeVue components used for complex UI elements

Code complexity MUST be justified. Simpler alternatives are preferred unless complexity delivers measurable value.

## Governance

This constitution supersedes all other development practices. Amendments require:
- Documentation of the change rationale
- Version bump following semantic versioning (MAJOR.MINOR.PATCH)
- Update to affected templates and guidance documents
- Verification that existing features remain compliant

All developers MUST verify constitution compliance during code review. Violations MUST be addressed before merge unless explicitly approved as justified exceptions (documented in Complexity Tracking).

**Version**: 1.2.0 | **Ratified**: TODO(RATIFICATION_DATE): Initial constitution adoption date | **Last Amended**: 2026-01-10
