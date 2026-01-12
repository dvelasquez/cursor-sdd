# Research: Authentication Flow - Login and Registration

**Feature**: 006-clerk-auth  
**Date**: 2026-01-11  
**Purpose**: Research Clerk integration with Astro, dev/staging environments, and E2E testing strategies

## Research Questions

### Q1: How does Clerk integrate with Astro?

**Decision**: Use `@clerk/astro` package - Clerk's official Astro integration that provides SSR support and seamless authentication.

**Rationale**:

- `@clerk/astro` is the official Clerk package for Astro framework
- Provides server-side authentication support with Astro SSR
- Integrates with Astro middleware for route protection
- Supports both pre-built components and custom authentication flows
- Works with existing Astro SSR setup (@astrojs/node adapter already configured)

**Key Requirements**:

- Install `@clerk/astro` package
- Configure Clerk publishable and secret keys via environment variables
- Set up Clerk middleware in Astro for SSR support
- Use Clerk's `<ClerkProvider>` wrapper for client-side components
- Create login (`/sign-in`) and registration (`/sign-up`) pages

**Alternatives Considered**:

- Direct Clerk SDK integration: Rejected - `@clerk/astro` provides better Astro integration
- Auth0 or other providers: Rejected - user specified Clerk explicitly
- Custom authentication: Rejected - violates requirement for minimal setup with defaults

**Implementation Notes**:

- Clerk Dashboard setup required (create application, get API keys)
- Environment variables: `PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Middleware configuration in `src/middleware.ts` (if SSR routes needed)
- ClerkProvider wraps client-side Vue components if needed
- Use Clerk's default sign-in/sign-up components or custom flows with hooks

---

### Q2: How to set up dev/staging environments in Clerk?

**Decision**: Create separate Clerk applications for development and production environments. Use separate API keys per environment to ensure test isolation.

**Rationale**:

- Clerk provides Development and Production instance types
- Development instances have relaxed security posture suitable for local testing
- Production instances have stricter security measures
- Clerk does not provide dedicated staging instances, but separate applications provide isolation
- Separate applications prevent test data from interfering with production
- Free upgrades available for staging applications on Pro/Enterprise/Startup plans

**Setup Strategy**:

1. Create Development application in Clerk Dashboard for local development
2. Create Production application for production deployment (or future staging)
3. Use environment-specific API keys:
   - Development: `.env.local` with development keys
   - Production: Deployment platform environment variables with production keys
4. Configure separate redirect URLs per environment

**Test Isolation**:

- Development application used for local testing and E2E tests
- Production application never accessed by test code
- E2E tests register/delete users in development application only
- Test users isolated from production user data

**Alternatives Considered**:

- Single Clerk application with environment-based configuration: Rejected - insufficient isolation, test data could contaminate production
- Mock authentication for testing: Rejected - violates requirement to test real authentication flows
- Production application for all environments: Rejected - too risky, could affect live users

---

### Q3: How to implement E2E tests for authentication flows with test isolation?

**Decision**: Use Playwright with `@clerk/testing` package and Clerk Test Mode to test authentication flows. Use Clerk Test Mode email addresses (`+clerk_test` subaddress) and verification code (`424242`) for repeatable tests without user cleanup.

**Rationale**:

- Playwright already configured in project (v1.57.0, feature 004)
- `@clerk/testing` provides Playwright helpers for Clerk authentication
- Clerk Test Mode is enabled by default in development instances
- Test Mode eliminates need for user cleanup (test emails recognized automatically)
- Test Mode provides universal verification code (`424242`) for all test emails/phones
- Simpler test implementation (no programmatic user creation/deletion needed)
- Test isolation achieved by using development Clerk application with separate API keys

**Test Strategy**:

1. **Test User Creation**: Use Clerk Test Mode email format (`test+clerk_test@example.com`) for registration
2. **Authentication Flow Testing**: Use `@clerk/testing` helpers to test sign-in/sign-up
3. **Email Verification**: Use test verification code `424242` if email verification is enabled
4. **User Cleanup**: Not required - Clerk Test Mode users don't need cleanup (test emails are automatically recognized)
5. **Isolation**: All tests use development Clerk application keys from `.env` file

**Clerk Test Mode Features**:

- **Test Email Format**: `*+clerk_test@example.com` (any email with `+clerk_test` subaddress)
- **Test Verification Code**: `424242` (universal code for all test emails and phone numbers)
- **No Email/SMS Sent**: Test Mode bypasses actual email/SMS sending
- **Development Instances**: Test Mode enabled by default
- **Test Phone Numbers**: `+1 (XXX) 555-0100` to `+1 (XXX) 555-0199` (optional, for phone auth)

**Implementation Pattern**:

```typescript
// Example test pattern using Clerk Test Mode
const testEmail = 'test+clerk_test@example.com';
const testVerificationCode = '424242';

test('user can register and login', async ({ page }) => {
  // 1. Register user via UI using test email
  // 2. Enter verification code if email verification enabled
  // 3. Validate registration succeeded
  // 4. Login with registered credentials using clerk.signIn helper
  // 5. Verify authentication state
  // No cleanup needed - test mode handles it automatically
});
```

**Key Requirements**:

- Install `@clerk/testing` as dev dependency
- Configure test environment with development Clerk API keys
- Use Clerk Test Mode email format (`+clerk_test` subaddress)
- Handle email verification with test code `424242` if enabled
- Use `clerk.signIn()` helper for login flows

**Clerk Testing Tools**:

- `@clerk/testing/playwright`: Playwright helpers for authentication flows
- Clerk Test Mode: Built-in testing features (test emails, verification codes)
- Testing tokens: Optional, for bypassing bot detection in tests

**Alternatives Considered**:

- Programmatic user creation/deletion via SDK: Rejected - unnecessary complexity, Test Mode provides simpler approach
- Manual test user creation in Clerk Dashboard: Rejected - not repeatable, manual cleanup required
- Generating unique test users: Rejected - unnecessary, Test Mode allows reusing same test email

---

### Q4: What are Clerk's default authentication configurations?

**Decision**: Use Clerk's default email/password authentication with minimal customization. Rely on Clerk's default UI components and behavior unless customization is explicitly required.

**Rationale**:

- User requirement: "Keep it minimal and with the defaults"
- Clerk's default email/password flow is standard and well-tested
- Default UI components provide good UX out of the box
- Minimal configuration reduces complexity and maintenance burden
- Defaults can be customized later if needed

**Default Configuration**:

- Authentication method: Email/password (enabled by default)
- Email verification: Enabled (default behavior)
- Password requirements: Clerk's default password policy
- Session management: Clerk's default session handling
- Redirect behavior: Configured per route (redirect to origin page after auth)

**Customization Scope (Minimal)**:

- Redirect URLs: Configured to redirect to origin page after successful auth (per spec clarification)
- Sign-in/sign-up page paths: `/sign-in` and `/sign-up` (standard paths)
- No custom UI components unless required by spec
- No custom authentication methods (social login, etc.) in this phase

**Alternatives Considered**:

- Custom authentication UI: Rejected - violates "minimal and defaults" requirement
- Social authentication (OAuth): Rejected - out of scope, not in spec
- Custom password policies: Rejected - use Clerk defaults, add complexity without benefit

---

## Technology Decisions Summary

| Technology              | Choice                                               | Rationale                                              |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| Authentication Provider | Clerk (@clerk/astro)                                 | Official Astro integration, SSR support, minimal setup |
| Dev Environment         | Separate Clerk Development application               | Test isolation, relaxed security for development       |
| E2E Testing             | Playwright + @clerk/testing                          | Already configured, official Clerk testing support     |
| Test Isolation          | Development Clerk app with programmatic user cleanup | Prevents test data contamination, repeatable tests     |
| Auth Configuration      | Clerk defaults (email/password)                      | Minimal setup per requirements, can customize later    |
| User Lifecycle (Tests)  | Register → Validate → Login → Delete                 | Clean test state, repeatable test execution            |

---

## Implementation Priorities

1. **Phase 0 (Setup)**: Clerk Dashboard setup, development application creation, API keys configuration
2. **Phase 1 (Integration)**: Install @clerk/astro, configure middleware, create sign-in/sign-up pages
3. **Phase 2 (Testing)**: Set up E2E tests with @clerk/testing, implement user lifecycle pattern
4. **Phase 3 (Validation)**: Progressive testing per constitution, browser validation, E2E test execution

---

## References

- Clerk Astro Integration: https://docs.astro.build/en/guides/authentication/
- Clerk Environments: https://clerk.com/docs/guides/development/managing-environments
- Clerk Testing: https://clerk.com/docs/testing/overview
- Clerk Playwright Testing: https://clerk.com/docs/guides/development/testing/playwright/test-authenticated-flows
- Clerk SDK Snippets (MCP): Available via Clerk MCP server
