# Tasks: Vue Prime UI Library Integration and Standard Layouts

**Input**: Design documents from `/specs/002-vue-prime-layouts/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Testing**: Per constitution, ALL implementations MUST follow progressive testing discipline:
1. Static analysis (lint, typecheck) MUST pass
2. E2E validation: Application MUST load in browser and function without errors
3. Progressive integration: For new infrastructure, follow: verify installation → test component rendering → verify layout integration → refine styling
4. No unit/integration tests for this UI-only phase - progressive E2E validation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory structure: create `src/components/vue/` directory
- [x] T002 Create directory structure: create `src/lib/fixtures/` directory
- [x] T003 [P] Install PrimeVue dependencies: run `pnpm install primevue@4.5.4 primeicons tailwindcss-primeui` in project root
- [x] T004 [P] Install PrimeVue theme preset: run `pnpm install @primeuix/themes` in project root

### Progressive Integration Validation for Setup (MANDATORY per constitution) ⚠️

- [x] T005 Verify installation: run `pnpm list primevue primeicons tailwindcss-primeui @primeuix/themes` to confirm packages installed
- [x] T006 Static analysis check: run `pnpm astro check` to verify no TypeScript errors after installation

**Checkpoint**: Dependencies installed and verified - configuration can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### PrimeVue Configuration

- [x] T007 Configure Tailwind CSS integration: add `@import "tailwindcss-primeui";` after `@import "tailwindcss";` in `src/styles/global.css`
- [x] T008 Create Vue app entrypoint: create `src/pages/_app.ts` with PrimeVue configuration (styled mode with Aura theme)
- [x] T009 Update Astro configuration: modify `astro.config.mjs` to add `appEntrypoint: '/src/pages/_app'` to Vue integration

### Progressive Integration Validation for Foundation (MANDATORY per constitution) ⚠️

For PrimeVue integration:

- [x] T010 Step 1: Verify PrimeVue installation succeeds - start dev server with `pnpm dev` and check browser console for errors
- [x] T011 Step 2: Test basic PrimeVue component rendering - create simple test component and verify it renders in browser
- [x] T012 Step 3: Verify Tailwind utilities work with PrimeVue - test `bg-primary` and `rounded-border` utilities in browser
- [x] T013 Step 4: Refine configuration if needed based on browser verification

**Checkpoint**: Foundation ready and validated - PrimeVue configured and rendering in browser - user story implementation can now begin

---

## Phase 3: User Story 1 - View Public Pages with Standard Layout (Priority: P1) 🎯 MVP

**Goal**: Users visiting public-facing pages see a consistent, professional layout structure with standard navigation, header, main content area, and footer.

**Independent Test**: Visit any public page route and verify all layout elements (header, navigation, footer, content area) render correctly with appropriate styling.

### Progressive Implementation - Step by Step

#### Step 1: Basic Vue Component Integration on Homepage

- [x] T014 [US1] Create simple Vue component: create `src/components/vue/TestButton.vue` with a PrimeVue Button component that displays "Click Me"
- [x] T015 [US1] Update homepage with Vue component: modify `src/pages/index.astro` to import and display TestButton with `client:load` directive, replacing Welcome component
- [x] T016 [US1] Verify component renders: start dev server, visit homepage at `http://localhost:4321`, verify PrimeVue button renders and responds to clicks

**Checkpoint**: PrimeVue component successfully integrated and visible on homepage

#### Step 2: Create Simple Layout Structure with Placeholders

- [ ] T017 [US1] Create PublicLayout skeleton: create `src/layouts/PublicLayout.astro` with basic HTML structure containing `<header>`, `<main>`, and `<footer>` placeholders (no styling yet)
- [ ] T018 [US1] Update homepage to use PublicLayout: modify `src/pages/index.astro` to use PublicLayout instead of Layout component
- [ ] T019 [US1] Verify layout structure: visit homepage, verify header, main, and footer sections are visible in browser (even if unstyled)

**Checkpoint**: Basic layout structure in place with header, main, footer sections visible

#### Step 3: Add Header with Navigation Placeholder

- [ ] T020 [US1] Create navigation component skeleton: create `src/components/vue/PublicNav.vue` with a simple div containing placeholder text "Navigation" (no styling yet)
- [ ] T021 [US1] Add navigation to header: modify `src/layouts/PublicLayout.astro` to include PublicNav component in header with `client:load` directive
- [ ] T022 [US1] Verify navigation appears: visit homepage, verify "Navigation" placeholder text appears in header section

**Checkpoint**: Navigation placeholder visible in header

#### Step 4: Style Navigation Bar for Public

- [ ] T023 [US1] Implement navigation with PrimeVue Menubar: modify `src/components/vue/PublicNav.vue` to use PrimeVue Menubar component with navigation items (home, about, login) per spec clarification
- [ ] T024 [US1] Style navigation with Tailwind: add Tailwind utility classes to PublicNav component using `tailwindcss-primeui` utilities (e.g., `bg-primary`, `text-primary-contrast`, `rounded-border`)
- [ ] T025 [US1] Verify styled navigation: visit homepage, verify navigation bar displays with home, about, login links, styled correctly, and responsive behavior works

**Checkpoint**: Styled navigation bar visible and functional with PrimeVue components

#### Step 5: Create Footer

- [ ] T026 [US1] Create footer component: create `src/components/Footer.astro` (Astro component) with placeholder footer content "Footer content"
- [ ] T027 [US1] Add footer to PublicLayout: modify `src/layouts/PublicLayout.astro` to include Footer component in footer section
- [ ] T028 [US1] Style footer with Tailwind: add Tailwind utility classes to Footer component for basic styling (padding, background, text alignment)
- [ ] T029 [US1] Verify footer renders: visit homepage, verify footer appears at bottom of page with appropriate styling

**Checkpoint**: Footer visible and styled in layout

#### Step 6: Style Header Section

- [ ] T030 [US1] Style header container: modify `src/layouts/PublicLayout.astro` header section with Tailwind classes for proper spacing, background, and alignment
- [ ] T031 [US1] Verify header styling: visit homepage, verify header has appropriate styling and navigation is properly positioned

**Checkpoint**: Header styled and positioned correctly

#### Step 7: Style Main Content Area

- [ ] T032 [US1] Style main content area: modify `src/layouts/PublicLayout.astro` main section with Tailwind classes for proper padding, max-width, and responsive behavior
- [ ] T033 [US1] Verify main content area: visit homepage, verify main content area has appropriate styling and responsive behavior

**Checkpoint**: Main content area styled and responsive

#### Step 8: Complete Public Layout Integration

- [ ] T034 [US1] Ensure layout consistency: verify PublicLayout provides consistent structure (header, navigation, main, footer) across all sections
- [ ] T035 [US1] Verify responsive design: test PublicLayout at different screen sizes (320px, 768px, 1024px, 1920px) using browser dev tools, verify layout adapts correctly per SC-003

**Checkpoint**: Public layout complete with all sections styled and responsive

#### Step 9: Create Example Public Page

- [ ] T036 [US1] Create about page: create `src/pages/about.astro` using PublicLayout with sample content "About Us" heading and paragraph
- [ ] T037 [US1] Verify navigation works: visit homepage, click "About" link in navigation, verify about page loads with same PublicLayout structure
- [ ] T038 [US1] Verify layout consistency: visit both homepage and about page, verify layout structure is identical across pages per SC-001

**Checkpoint**: Example public page created and navigation functional

### E2E Validation for User Story 1 (MANDATORY per constitution) ⚠️

- [ ] T039 [US1] Run static analysis: run `pnpm astro check` and verify linting and type checking pass
- [ ] T040 [US1] Build application: run `pnpm build` and verify build completes without errors
- [ ] T041 [US1] Start application and load pages: run `pnpm dev`, visit homepage at `http://localhost:4321`, verify page loads without errors
- [ ] T042 [US1] Verify no console errors: open browser dev tools console, verify no JavaScript errors, runtime errors, or warnings
- [ ] T043 [US1] Test complete user journey: visit homepage → click navigation links → verify page transitions work → verify layout remains consistent
- [ ] T044 [US1] Verify responsive behavior: test at 320px, 768px, 1024px, 2560px widths, verify layout adapts correctly per SC-003
- [ ] T045 [US1] Verify acceptance criteria: confirm all acceptance scenarios from spec are met (header, navigation, footer, content area render correctly)

**Checkpoint**: User Story 1 complete, validated end-to-end, independently testable - Public layout foundation established

---

## Phase 4: User Story 2 - View Authenticated Pages with Standard Private Layout (Priority: P2)

**Goal**: Authenticated users accessing private application pages see a consistent layout structure with user-specific navigation, authentication state indicators (username/email, avatar/initial, logout button), and appropriate access controls.

**Independent Test**: Simulate authenticated session with mock data, visit private page route, verify user-specific elements (profile indicators, private navigation, logout options) appear correctly in header top-right.

**Dependency**: User Story 1 must be complete (public layout foundation established)

### Progressive Implementation - Step by Step

#### Step 1: Create Mock User Session Fixture

- [ ] T046 [US2] Create mock user session fixture: create `src/lib/fixtures/mock-user-session.ts` with MockUserSession interface containing id, username, email, avatar (null), initial ("JD"), isAuthenticated (true) per data-model.md
- [ ] T047 [US2] Export mock session: export `mockUserSession` constant from fixture file with example data
- [ ] T048 [US2] Verify fixture file: run `pnpm astro check` to verify TypeScript types are correct for mock session

**Checkpoint**: Mock user session fixture created and type-safe

#### Step 2: Create User Profile Component

- [ ] T049 [US2] Create UserProfile component skeleton: create `src/components/vue/UserProfile.vue` with props accepting MockUserSession, display username/email as placeholder text (no styling yet)
- [ ] T050 [US2] Add avatar/initial display: modify UserProfile component to display PrimeVue Avatar component with initial fallback (use `initial` prop when `avatar` is null)
- [ ] T051 [US2] Add logout button: modify UserProfile component to include PrimeVue Button component labeled "Logout" (no functionality yet)
- [ ] T052 [US2] Test UserProfile component: create temporary test page using UserProfile with mock session, verify username, avatar/initial, and logout button render

**Checkpoint**: UserProfile component renders username, avatar/initial, and logout button

#### Step 3: Position UserProfile in Header Top-Right

- [ ] T053 [US2] Style UserProfile positioning: add Tailwind utility classes to UserProfile component for top-right header positioning (flex, items-center, gap, etc.)
- [ ] T054 [US2] Verify positioning: test UserProfile component, verify it displays correctly positioned for header top-right layout

**Checkpoint**: UserProfile positioned correctly for header top-right

#### Step 4: Create Private Layout Structure

- [ ] T055 [US2] Create PrivateLayout skeleton: create `src/layouts/PrivateLayout.astro` with basic HTML structure containing `<header>`, `<main>`, and `<footer>` sections (similar to PublicLayout but for private pages)
- [ ] T056 [US2] Add UserProfile to PrivateLayout header: modify PrivateLayout to include UserProfile component in header section with mock session data and `client:load` directive
- [ ] T057 [US2] Verify PrivateLayout structure: create temporary private test page, verify header, main, footer sections render with UserProfile visible

**Checkpoint**: PrivateLayout structure created with UserProfile visible in header

#### Step 5: Create Private Navigation

- [ ] T058 [US2] Create PrivateNav component: create `src/components/vue/PrivateNav.vue` using PrimeVue Menubar with navigation items (dashboard, profile, logout) per spec clarification
- [ ] T059 [US2] Style PrivateNav with Tailwind: add Tailwind utility classes to PrivateNav using `tailwindcss-primeui` utilities for consistent styling with PublicNav
- [ ] T060 [US2] Add PrivateNav to PrivateLayout: modify `src/layouts/PrivateLayout.astro` to include PrivateNav component in header alongside UserProfile
- [ ] T061 [US2] Verify private navigation: visit private test page, verify navigation shows dashboard, profile, logout links and is positioned correctly in header

**Checkpoint**: Private navigation visible and functional in PrivateLayout

#### Step 6: Implement Logout Functionality

- [ ] T062 [US2] Add logout handler to UserProfile: modify UserProfile component to emit 'logout' event when logout button is clicked
- [ ] T063 [US2] Handle logout in PrivateLayout: modify PrivateLayout to handle logout event (mock behavior: redirect to homepage or show alert for now)
- [ ] T064 [US2] Test logout functionality: visit private page, click logout button, verify logout event triggers and layout transitions appropriately per FR-005

**Checkpoint**: Logout functionality works (mock behavior) and layout transitions appropriately

#### Step 7: Style Private Layout to Match Public Layout

- [ ] T065 [US2] Apply consistent styling to PrivateLayout: modify PrivateLayout header, main, footer sections with same Tailwind classes as PublicLayout for visual consistency per FR-006
- [ ] T066 [US2] Verify visual consistency: visit both public and private pages side-by-side, verify shared design language (colors, spacing, typography) is consistent

**Checkpoint**: Private layout maintains visual consistency with public layout

#### Step 8: Ensure Authentication State Visibility

- [ ] T067 [US2] Verify auth indicators visible: visit private page, verify authentication state (username, avatar, logout button) is clearly visible within 1 second of page load per SC-002
- [ ] T068 [US2] Test responsive behavior: test PrivateLayout at different screen sizes, verify authentication state indicators remain visible and positioned correctly

**Checkpoint**: Authentication state clearly visible and responsive in private layout

#### Step 9: Create Example Private Page

- [ ] T069 [US2] Create dashboard page: create `src/pages/dashboard/index.astro` using PrivateLayout with sample content "Dashboard" heading and paragraph
- [ ] T070 [US2] Verify private navigation works: visit dashboard page, click navigation links (dashboard, profile), verify page transitions work correctly
- [ ] T071 [US2] Verify layout consistency: visit dashboard page, verify PrivateLayout structure is consistent and authentication state is visible

**Checkpoint**: Example private page created with consistent layout structure

### E2E Validation for User Story 2 (MANDATORY per constitution) ⚠️

- [ ] T072 [US2] Run static analysis: run `pnpm astro check` and verify linting and type checking pass
- [ ] T073 [US2] Build application: run `pnpm build` and verify build completes without errors
- [ ] T074 [US2] Start application and load private pages: run `pnpm dev`, visit dashboard page, verify page loads without errors
- [ ] T075 [US2] Verify no console errors: open browser dev tools console, verify no JavaScript errors, runtime errors, or warnings on private pages
- [ ] T076 [US2] Test complete user journey: visit dashboard page → verify auth indicators visible → click navigation links → click logout → verify layout transition
- [ ] T077 [US2] Verify responsive behavior: test PrivateLayout at 320px, 768px, 1024px, 2560px widths, verify auth state visibility maintained per SC-003
- [ ] T078 [US2] Verify acceptance criteria: confirm all acceptance scenarios from spec are met (user identification, auth state indicators, private navigation, logout functionality)

**Checkpoint**: User Story 2 complete, validated end-to-end, independently testable with mock authentication - Private layout foundation established

---

## Phase 5: User Story 3 - Enhanced Homepage with Component Library Integration (Priority: P3)

**Goal**: Users visiting the application homepage see an improved visual experience using modern UI components that demonstrate the application's capabilities and provide an engaging entry point.

**Independent Test**: Visit homepage route, verify updated components render correctly, interact appropriately, and demonstrate modern UI patterns while maintaining consistency with standard public layout structure.

**Dependency**: User Story 1 must be complete (public layout foundation established)

### Progressive Implementation - Step by Step

#### Step 1: Enhance Homepage with PrimeVue Components

- [ ] T079 [US3] Add PrimeVue Card component to homepage: modify `src/pages/index.astro` to include a PrimeVue Card component in main content area with sample content
- [ ] T080 [US3] Style Card with Tailwind: add Tailwind utility classes to Card component using `tailwindcss-primeui` utilities (bg-primary, rounded-border, etc.)
- [ ] T081 [US3] Verify Card renders: visit homepage, verify Card component displays correctly with proper styling

**Checkpoint**: PrimeVue Card component visible on homepage

#### Step 2: Add Interactive Components

- [ ] T082 [US3] Add interactive Button component: add PrimeVue Button component to homepage Card with hover effects and click handler (show alert for now)
- [ ] T083 [US3] Verify button interactivity: visit homepage, hover over button, click button, verify visual feedback works within 100ms per SC-006
- [ ] T084 [US3] Verify component interaction: test all interactive components on homepage, verify appropriate visual feedback on clicks, hovers, form interactions

**Checkpoint**: Interactive components functional with proper visual feedback

#### Step 3: Add More PrimeVue Components for Demonstration

- [ ] T085 [US3] Add additional PrimeVue components: add one or more PrimeVue components to homepage (e.g., Badge, Chip, Tag, Avatar) to demonstrate component library capabilities
- [ ] T086 [US3] Style components consistently: ensure all added components use Tailwind utilities from `tailwindcss-primeui` for consistent styling
- [ ] T087 [US3] Verify all components render: visit homepage, verify all PrimeVue components display correctly without visual glitches or layout shifts per SC-004

**Checkpoint**: Multiple PrimeVue components visible and styled on homepage

#### Step 4: Ensure Layout Consistency

- [ ] T088 [US3] Verify homepage uses PublicLayout: confirm homepage still uses PublicLayout component to maintain consistency with other public pages per FR-006
- [ ] T089 [US3] Verify layout structure maintained: visit homepage, verify header, navigation, main (with enhanced components), footer structure is consistent with other public pages

**Checkpoint**: Homepage maintains layout consistency while displaying enhanced components

#### Step 5: Optimize Homepage Performance

- [ ] T090 [US3] Verify load time: test homepage load time, verify enhanced UI components load and render without visual glitches in under 2 seconds on standard broadband connection per SC-004
- [ ] T091 [US3] Verify no layout shifts: use browser dev tools to verify no cumulative layout shift (CLS) occurs during component rendering
- [ ] T092 [US3] Optimize if needed: if load time exceeds 2 seconds, optimize component loading or reduce initial component count

**Checkpoint**: Homepage meets performance criteria (SC-004)

#### Step 6: Test Responsive Behavior

- [ ] T093 [US3] Verify responsive components: test homepage at different screen sizes (320px, 768px, 1024px, 2560px), verify all components adapt appropriately to viewport size
- [ ] T094 [US3] Verify component interaction on mobile: test interactive components on mobile viewport, verify touch interactions work correctly

**Checkpoint**: Homepage components responsive across all screen sizes

### E2E Validation for User Story 3 (MANDATORY per constitution) ⚠️

- [ ] T095 [US3] Run static analysis: run `pnpm astro check` and verify linting and type checking pass
- [ ] T096 [US3] Build application: run `pnpm build` and verify build completes without errors
- [ ] T097 [US3] Start application and load homepage: run `pnpm dev`, visit homepage, verify page loads without errors
- [ ] T098 [US3] Verify no console errors: open browser dev tools console, verify no JavaScript errors, runtime errors, or warnings on homepage
- [ ] T099 [US3] Test complete user journey: visit homepage → interact with all components → verify visual feedback → verify layout consistency maintained
- [ ] T100 [US3] Verify responsive behavior: test homepage at 320px, 768px, 1024px, 2560px widths, verify all components adapt correctly per SC-003
- [ ] T101 [US3] Verify acceptance criteria: confirm all acceptance scenarios from spec are met (updated UI components, visual appeal, modern design, layout consistency, responsive behavior)

**Checkpoint**: User Story 3 complete, validated end-to-end, independently testable - Homepage enhanced with PrimeVue components

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T102 [P] Verify layout consistency across all pages: visit all public and private pages, verify visual consistency per FR-006
- [ ] T103 [P] Code cleanup: review all Vue and Astro components, ensure consistent code style and organization
- [ ] T104 [P] Remove temporary test files: clean up any temporary test pages or components created during development
- [ ] T105 [P] Documentation review: verify quickstart.md steps are accurate based on actual implementation
- [ ] T106 Run final E2E validation: test complete user journey across all pages (public → private → homepage), verify all features work together

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - Can start independently
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (uses public layout foundation)
- **User Story 3 (Phase 5)**: Depends on User Story 1 completion (uses public layout structure)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **🎯 MVP**
- **User Story 2 (P2)**: Can start after User Story 1 - Uses public layout foundation, but independently testable with mock auth
- **User Story 3 (P3)**: Can start after User Story 1 - Uses public layout structure, independently testable

### Within Each User Story

Tasks within each user story follow progressive implementation:
1. Create basic structure/skeleton
2. Add components progressively
3. Style incrementally
4. Verify at each checkpoint
5. E2E validation before marking complete

### Progressive Testing Per Task

Per constitution, after each significant task:
- Verify static analysis passes (`pnpm astro check`)
- Start dev server (`pnpm dev`)
- Load affected pages in browser
- Verify no console errors
- Verify changes render correctly
- Proceed to next task

### Parallel Opportunities

- **Setup tasks**: T001-T004 can run in parallel (different directories/commands)
- **Foundation configuration**: T007-T009 can run in parallel (different files)
- **User Story 2 and 3**: Can start in parallel after User Story 1 completes (different pages/components)
- **Polish tasks**: T102-T105 can run in parallel (different aspects)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories), including progressive integration validation
3. Complete Phase 3: User Story 1 (progressive implementation step-by-step + E2E validation)
4. **STOP and VALIDATE**: Verify User Story 1 end-to-end (static analysis passes, app loads, no errors, layout works in browser)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational (with progressive integration validation) → Foundation ready and validated
2. Complete User Story 1 progressively (T014 → T045) → E2E validation → Deploy/Demo (MVP!)
3. Add User Story 2 progressively (T046 → T078) → E2E validation → Deploy/Demo
4. Add User Story 3 progressively (T079 → T101) → E2E validation → Deploy/Demo
5. Polish and finalize (T102 → T106)

### Progressive One-Step-at-a-Time Approach

Each task is atomic and should be:
1. **Completed**: Implement the task
2. **Validated**: Verify it works in browser (dev server, check console, verify rendering)
3. **Committed**: Commit the change
4. **Reviewed**: Manual review before proceeding to next task

This ensures:
- Changes are incremental and reviewable
- Each step is verified before moving forward
- Errors are caught early
- Rollback is easier if needed

---

## Notes

- **[P] tasks** = different files, no dependencies - can be worked on simultaneously
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify in browser after each task or checkpoint (progressive testing per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tasks are ordered to be progressive - complete in sequence within each phase unless marked [P]
- Avoid: vague tasks, same file conflicts, skipping verification steps

---

## Task Summary

**Total Tasks**: 106
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 8 tasks
- **Phase 3 (User Story 1)**: 32 tasks (progressive, step-by-step)
- **Phase 4 (User Story 2)**: 33 tasks (progressive, step-by-step)
- **Phase 5 (User Story 3)**: 16 tasks (progressive, step-by-step)
- **Phase 6 (Polish)**: 5 tasks

**Independent Test Criteria**:
- **US1**: Visit any public page, verify header, navigation, footer, content area render correctly
- **US2**: Visit private page with mock auth, verify auth indicators, private navigation, logout functionality
- **US3**: Visit homepage, verify enhanced components render, interact correctly, maintain layout consistency

**Suggested MVP Scope**: User Story 1 only (Phase 1 + Phase 2 + Phase 3) - Establishes public layout foundation

**Parallel Opportunities**: Setup tasks, Foundation configuration tasks, User Stories 2 and 3 after US1 completes, Polish tasks
