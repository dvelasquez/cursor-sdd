# Contracts: Authentication Flow - Login and Registration

**Feature**: 006-clerk-auth  
**Date**: 2026-01-11  
**Purpose**: Define API contracts and interfaces for authentication flow

## Overview

This feature uses Clerk for authentication, which provides authentication APIs and client SDK. This document defines the application-level contracts and integration points with Clerk.

**Note**: Since authentication is handled by Clerk's external service, these contracts define how the application integrates with Clerk rather than internal API endpoints.

---

## Integration Contracts

### 1. Clerk Provider Setup

**Purpose**: Initialization contract for Clerk in Astro application.

**Contract**:

- ClerkProvider must wrap client-side components that use Clerk hooks
- Environment variables must be configured before application start
- Middleware must be configured for SSR routes (if SSR used)

**Configuration**:

```typescript
// Environment variables required
PUBLIC_CLERK_PUBLISHABLE_KEY: string;
CLERK_SECRET_KEY: string;
```

**Initialization**:

- ClerkProvider wraps root layout or specific pages
- Middleware configured in `src/middleware.ts` for SSR support
- Client components use Clerk hooks (`useAuth`, `useUser`, `useSignIn`, `useSignUp`)

---

### 2. Authentication Pages Contract

**Purpose**: Contract for login and registration pages.

#### Sign-In Page (`/sign-in`)

**Requirements**:

- Accessible without authentication (FR-002)
- Accepts email and password
- Validates credentials via Clerk
- Shows error messages on failure (FR-006)
- Redirects to origin page after successful authentication (FR-009)

**Behavior**:

- Page load: Display login form (unauthenticated state)
- Form submission: Call Clerk `signIn.create()` with email/password
- Success: Call `setActive()` with session, redirect to origin page
- Failure: Display error message, remain on page

#### Sign-Up Page (`/sign-up`)

**Requirements**:

- Accessible without authentication (FR-001)
- Accepts email and password
- Creates user account via Clerk
- Shows error messages on validation failure (FR-005)
- Redirects to origin page after successful registration (FR-009)

**Behavior**:

- Page load: Display registration form (unauthenticated state)
- Form submission: Call Clerk `signUp.create()` with email/password
- Email verification: If required, send verification code
- Success: Call `setActive()` with session, redirect to origin page
- Failure: Display error message, remain on page

---

### 3. Redirect Behavior Contract

**Purpose**: Contract for post-authentication redirect behavior.

**Requirement**: FR-009 - After successful registration or login, redirect users to the origin page that was trying to load.

**Implementation**:

- Store origin URL in query parameter or Clerk redirect configuration
- After successful authentication, redirect to stored origin URL
- If no origin URL exists, redirect to homepage (`/`)

**Contract**:

```typescript
// Redirect behavior
afterSignInRedirect: string | null; // Origin page URL or null
afterSignUpRedirect: string | null; // Origin page URL or null
fallbackRedirect: '/'; // Homepage if no origin
```

---

### 4. Error Handling Contract

**Purpose**: Contract for authentication error handling and user feedback.

**Requirements**: FR-005 (registration validation errors), FR-006 (login validation errors)

**Error Types**:

- **Validation Errors**: Missing fields, invalid email format, password requirements
- **Authentication Errors**: Invalid credentials, user not found
- **Network Errors**: Connection failures, timeout

**Error Display**:

- Client-side: Display error messages in UI (form error state)
- User-facing: Clear, actionable error messages
- Server-side: Log technical error details (never expose to users)

**Contract**:

```typescript
interface AuthError {
  message: string; // User-facing error message
  code?: string; // Error code (optional, for logging)
  field?: string; // Field that caused error (optional)
}
```

---

## TypeScript Contracts

### Client-Side Hooks (Vue Components)

```typescript
/**
 * Clerk authentication hook return type
 * (from @clerk/clerk-react or @clerk/astro)
 */
interface UseAuthReturn {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  userId: string | null | undefined;
  sessionId: string | null | undefined;
  getToken: (options?: { template?: string }) => Promise<string | null>;
  signOut: () => Promise<void>;
}

/**
 * Clerk sign-in hook return type
 */
interface UseSignInReturn {
  isLoaded: boolean;
  signIn: ClerkSignIn;
  setActive: (params: { session: string }) => Promise<void>;
}

/**
 * Clerk sign-up hook return type
 */
interface UseSignUpReturn {
  isLoaded: boolean;
  signUp: ClerkSignUp;
  setActive: (params: { session: string }) => Promise<void>;
}
```

**Note**: Use Clerk's official TypeScript types from `@clerk/clerk-react` or `@clerk/astro` packages for exact type definitions.

---

### Server-Side API (SSR Routes)

```typescript
/**
 * Server-side auth function return type
 * (from @clerk/astro server-side API)
 */
interface ServerAuth {
  userId: string | null;
  sessionId: string | null;
  getToken: () => Promise<string | null>;
}

/**
 * Server-side currentUser function return type
 */
interface ServerUser {
  id: string;
  emailAddress: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  // ... additional Clerk User fields
}
```

**Note**: Use Clerk's server-side types from `@clerk/astro` for exact definitions.

---

## Testing Contracts

### E2E Test Contract

**Purpose**: Contract for E2E testing of authentication flows.

**Requirements**:

- Tests run against development Clerk application (test isolation)
- Tests use Clerk Test Mode for authentication flows
- Tests validate registration and login flows
- Tests use Clerk Test Mode email format (`+clerk_test` subaddress)
- Tests use test verification code (`424242`) for email verification if enabled

**Test User Lifecycle**:

1. **Register**: Register test user via UI using Clerk Test Mode email (`test+clerk_test@example.com`)
2. **Verify**: Enter test verification code (`424242`) if email verification enabled
3. **Authenticate**: Login with test user credentials using `clerk.signIn()` helper
4. **Verify**: Confirm authentication state
5. **Cleanup**: Not required - Clerk Test Mode handles test users automatically

**Clerk Test Mode Contract**:

```typescript
// Test Mode Configuration
const testEmail = 'test+clerk_test@example.com'; // Any email with +clerk_test subaddress
const testVerificationCode = '424242'; // Universal test verification code
const testPassword = 'TestPassword123!'; // Standard test password

// Test Mode Features:
// - No emails/SMS sent for test emails/phones
// - Verification code is always 424242
// - Test Mode enabled by default in development instances
// - No user cleanup needed (test users automatically recognized)
```

---

## Environment Configuration Contract

**Purpose**: Contract for environment-specific configuration.

**Development**:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Development app
CLERK_SECRET_KEY=sk_test_...              # Development app
```

**Testing (E2E)**:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Development app
CLERK_SECRET_KEY=sk_test_...              # Development app (for server)
CLERK_API_KEY=sk_test_...                 # Development app (for backend SDK)
```

**Production**:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # Production app
CLERK_SECRET_KEY=sk_live_...              # Production app
```

**Contract**:

- Development and testing use same Clerk development application
- Production uses separate Clerk production application
- API keys must be present for application to function
- Missing keys result in application startup failure (fail-fast)

---

## Validation Rules

1. **Authentication State**: Must be checked before accessing user data
2. **Error Handling**: All authentication errors must be caught and displayed to users
3. **Redirect Behavior**: Must always redirect after successful authentication (never leave on auth page)
4. **Test Isolation**: E2E tests must use development Clerk application only
5. **User Cleanup**: E2E tests must delete created users after test completion

---

## Dependencies

- `@clerk/astro`: Official Clerk integration for Astro
- `@clerk/testing`: Clerk testing utilities (dev dependency, for E2E tests)
- Clerk Backend SDK: For programmatic user management in tests (via `@clerk/clerk-sdk-node`)

---

## Future Enhancements

While out of scope for this feature, potential future contracts:

- **Protected Routes Contract**: Define contract for route protection middleware
- **Role-Based Access Contract**: If authorization added, define role/permission contracts
- **Session Management Contract**: If custom session handling needed
- **OAuth Integration Contract**: If social authentication added
