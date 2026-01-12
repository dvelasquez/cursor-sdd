# Data Model: Authentication Flow - Login and Registration

**Feature**: 006-clerk-auth  
**Date**: 2026-01-11  
**Purpose**: Define data structures for authentication flow using Clerk

## Overview

This feature uses Clerk for authentication, which manages user data and authentication state externally. This document defines the client-side data structures and types used in the application for authentication state and user information.

**Note**: User data is stored and managed by Clerk. The application receives user information via Clerk's client SDK and server-side APIs. No local user database is required for this feature.

## Entities

### 1. Authentication State (Client-Side)

**Purpose**: Represents the current authentication state in the application, provided by Clerk's client SDK.

**Type**: Clerk-provided authentication state (via `useAuth` hook or server-side `auth()`)

**Attributes**:

| Field        | Type                          | Source    | Description                                         |
| ------------ | ----------------------------- | --------- | --------------------------------------------------- |
| `isLoaded`   | `boolean`                     | Clerk SDK | Whether authentication state has loaded             |
| `isSignedIn` | `boolean \| undefined`        | Clerk SDK | Whether user is signed in (undefined while loading) |
| `userId`     | `string \| null \| undefined` | Clerk SDK | Current user's ID                                   |
| `sessionId`  | `string \| null \| undefined` | Clerk SDK | Current session ID                                  |

**Relationships**:

- Authentication State → User: One-to-one (when signed in, references current user)
- Authentication State → Session: One-to-one (when signed in, references current session)

**State Transitions**:

- `isSignedIn: undefined` → `isSignedIn: false` (no user authenticated)
- `isSignedIn: undefined` → `isSignedIn: true` (user authenticated)
- `isSignedIn: true` → `isSignedIn: false` (user signed out)

---

### 2. User Information (Client-Side)

**Purpose**: Represents user information retrieved from Clerk, used for display in authenticated UI.

**Type**: Clerk User object (via `useUser` hook or server-side `currentUser()`)

**Attributes**:

| Field          | Type             | Source    | Description                  |
| -------------- | ---------------- | --------- | ---------------------------- |
| `id`           | `string`         | Clerk SDK | Unique user identifier       |
| `emailAddress` | `string`         | Clerk SDK | Primary email address        |
| `firstName`    | `string \| null` | Clerk SDK | User's first name (optional) |
| `lastName`     | `string \| null` | Clerk SDK | User's last name (optional)  |
| `imageUrl`     | `string`         | Clerk SDK | Profile image URL            |

**Relationships**:

- User → Authentication State: One-to-one (user has current auth state)
- User → Session: One-to-many (user can have multiple sessions)

**Note**: Full User object from Clerk contains additional fields. Only fields relevant to this feature are listed above.

---

### 3. Authentication Pages State (UI)

**Purpose**: Client-side state for login and registration pages (form data, errors, loading states).

**Type**: Local component state (Vue component reactive state)

**Registration Page State**:

| Field      | Type             | Description                           |
| ---------- | ---------------- | ------------------------------------- |
| `email`    | `string`         | Email input value                     |
| `password` | `string`         | Password input value                  |
| `loading`  | `boolean`        | Whether registration is in progress   |
| `error`    | `string \| null` | Error message (if registration fails) |

**Login Page State**:

| Field      | Type             | Description                    |
| ---------- | ---------------- | ------------------------------ |
| `email`    | `string`         | Email input value              |
| `password` | `string`         | Password input value           |
| `loading`  | `boolean`        | Whether login is in progress   |
| `error`    | `string \| null` | Error message (if login fails) |

**Relationships**:

- Page State → Clerk Authentication: Uses Clerk SDK methods to perform authentication
- Page State → Redirect: After successful auth, redirects to origin page

---

## TypeScript Interfaces

### Client-Side Types

```typescript
/**
 * Authentication state provided by Clerk
 * (Type definition aligns with Clerk's useAuth hook return type)
 */
interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  userId: string | null | undefined;
  sessionId: string | null | undefined;
}

/**
 * User information provided by Clerk
 * (Type definition aligns with Clerk's User object - subset of fields)
 */
interface UserInfo {
  id: string;
  emailAddress: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

/**
 * Registration form state
 */
interface RegistrationFormState {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
}

/**
 * Login form state
 */
interface LoginFormState {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
}
```

**Note**: For full type safety, use Clerk's TypeScript types from `@clerk/astro` or `@clerk/clerk-react` packages directly rather than defining custom interfaces.

---

## Data Flow

### Registration Flow

```
User navigates to /sign-up
  ↓
Registration page loads (unauthenticated state)
  ↓
User fills form (email, password)
  ↓
User submits form
  ↓
Clerk SDK: signUp.create({ emailAddress, password })
  ↓
Email verification sent (if required by Clerk)
  ↓
User verifies email
  ↓
Clerk SDK: setActive({ session })
  ↓
Authentication state: isSignedIn = true
  ↓
Redirect to origin page (or homepage if no origin)
```

### Login Flow

```
User navigates to /sign-in
  ↓
Login page loads (unauthenticated state)
  ↓
User fills form (email, password)
  ↓
User submits form
  ↓
Clerk SDK: signIn.create({ identifier, password })
  ↓
Clerk SDK: setActive({ session })
  ↓
Authentication state: isSignedIn = true
  ↓
Redirect to origin page (or homepage if no origin)
```

---

## Constraints & Assumptions

1. **No Local User Storage**: User data is managed entirely by Clerk. No local database tables or user storage required.

2. **Client-Side State Only**: Authentication state and user information are retrieved from Clerk SDK. No local persistence of user data.

3. **Type Safety**: Use Clerk's TypeScript types from official packages for full type safety rather than custom interfaces.

4. **Server-Side Access**: In SSR routes, use Clerk's server-side APIs (`auth()`, `currentUser()`) instead of client hooks.

5. **Session Management**: Sessions are managed by Clerk. Application relies on Clerk's session handling.

6. **Redirect Behavior**: After successful authentication, redirect to origin page that was trying to load (per spec clarification). If no origin page, redirect to homepage.

---

## Environment Variables

**Development**:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Testing** (E2E tests):

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... (development app)
CLERK_SECRET_KEY=sk_test_... (development app)
CLERK_API_KEY=sk_test_... (for backend SDK in tests)
```

**Production**:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

---

## Future Considerations

While out of scope for this feature, potential future enhancements:

- **User Profile Storage**: If application needs to store additional user data, create local database tables linked to Clerk user IDs
- **Session Customization**: Custom session handling if needed
- **User Metadata**: Use Clerk's metadata fields (`publicMetadata`, `privateMetadata`) for application-specific user data
- **Organization Support**: If multi-tenant features needed, use Clerk Organizations
