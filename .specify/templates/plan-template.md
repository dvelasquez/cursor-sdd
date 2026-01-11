# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

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

**Language/Version**: JavaScript/TypeScript (per constitution)  
**Runtime**: Node.js (per constitution)  
**Framework**: Astro (per constitution)  
**UI Components**: Vue.js (Vue 3 composition API, per constitution)  
**Styling**: Tailwind CSS + PrimeVue (per constitution)  
**Storage**: [if applicable, e.g., PostgreSQL, files, or N/A]  
**Testing**: [e.g., Vitest, Playwright, or NEEDS CLARIFICATION - per constitution: progressive E2E validation required]  
**Target Platform**: [e.g., Web browsers, Node.js server, or NEEDS CLARIFICATION]  
**Project Type**: Web application (Astro framework, per constitution)  
**Performance Goals**: [domain-specific, e.g., <2s page load, 60 fps, or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable, or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 50 screens, or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with all constitution principles:

- **Type Safety**: All code will use TypeScript with strict mode. Runtime validation (Zod) only at boundaries.
- **Code Quality**: Linting and type checking will pass before any commit.
- **Testing Discipline**: Progressive testing workflow MUST be followed:
  - Static analysis (lint, typecheck) passes
  - Application loads in browser without errors after each change
  - New infrastructure (DB, services) follows progressive integration: connection → test data → UI display → refinement
  - Complete end-to-end validation in running application for all features
- **Incremental Delivery**: Features broken into independently testable increments

[Additional gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
