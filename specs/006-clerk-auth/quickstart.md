# Quickstart: Authentication Flow - Login and Registration

**Feature**: 006-clerk-auth  
**Date**: 2026-01-11  
**Purpose**: Step-by-step implementation guide for adding Clerk authentication

## Prerequisites

- Astro 5.16.8+ installed
- Node.js runtime
- Clerk account (free tier sufficient)
- Existing Astro project with SSR enabled (@astrojs/node adapter)
- Vue.js 3 integration (per constitution)
- Playwright 1.57.0 installed (for E2E tests)

## Step 1: Set Up Clerk Application

### 1.1 Create Clerk Account

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign up for a free account (if needed)
3. Create a new application

### 1.2 Create Development Application

1. In Clerk Dashboard, create a **Development** application
2. Name it (e.g., "cursor-sdd-dev")
3. Configure authentication methods:
   - Enable **Email** authentication
   - Enable **Password** authentication
   - Keep other methods disabled (minimal setup)
4. Note your API keys (will be shown after creation)

### 1.3 Get API Keys

From Clerk Dashboard → **API Keys**:

- `PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_...`)
- `CLERK_SECRET_KEY` (starts with `sk_test_...`)

**Note**: Development applications use `pk_test_...` and `sk_test_...` prefixes.

---

## Step 2: Install Clerk Dependencies

### 2.1 Install Clerk Astro Package

```bash
pnpm add @clerk/astro
```

### 2.2 Install Clerk Testing Package (Dev Dependency)

```bash
pnpm add -D @clerk/testing
```

### 2.3 Install Clerk Backend SDK (For E2E Tests)

```bash
pnpm add -D @clerk/clerk-sdk-node
```

**Note**: Backend SDK is only needed for programmatic user management in E2E tests.

---

## Step 3: Configure Environment Variables

### 3.1 Create Environment File

Create or update `.env` file in project root:

```env
# Development Clerk Application
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3.2 Create Test Environment File (Optional)

For E2E tests, create `.env.test` (or use `.env` with development keys):

```env
# Development Clerk Application (for tests)
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_API_KEY=sk_test_...  # Same as CLERK_SECRET_KEY for backend SDK
```

**Note**: Use development application keys for both development and testing to ensure test isolation from production.

### 3.3 Configure Environment Access

Clerk keys are accessed via environment variables. Astro automatically loads `.env` files.

**Important**:

- `PUBLIC_CLERK_PUBLISHABLE_KEY` must be prefixed with `PUBLIC_` to be accessible client-side
- `CLERK_SECRET_KEY` is server-side only (not prefixed with `PUBLIC_`)

---

## Step 4: Configure Clerk in Astro

### 4.1 Update Astro Config

Update `astro.config.mjs` to configure Clerk middleware:

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import db from '@astrojs/db';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [vue({ appEntrypoint: '/src/pages/_app' }), db(), clerk()],
  // ... rest of config
  adapter: node({
    mode: 'standalone',
  }),
  output: 'server', // Required for Clerk SSR integration
});
```

### 4.2 Create Middleware (Optional for SSR Routes)

If SSR routes need authentication, create `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define protected routes (none in this phase, but structure for future)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // For this phase, no routes are protected
  // This middleware structure is for future use
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Note**: For this phase (no protected routes), middleware is optional but recommended for future expansion.

---

## Step 5: Create Authentication Pages

### 5.1 Create Sign-In Page

Create `src/pages/sign-in/index.astro`:

```astro
---
import PublicLayout from '../../layouts/PublicLayout.astro';
import { SignIn } from '@clerk/astro/components';
---

<PublicLayout>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Sign In</h1>
    <div class="flex justify-center">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  </div>
</PublicLayout>
```

**Note**: `redirectUrl="/"` is default. Clerk will handle redirect to origin page if configured in Clerk Dashboard.

### 5.2 Create Sign-Up Page

Create `src/pages/sign-up/index.astro`:

```astro
---
import PublicLayout from '../../layouts/PublicLayout.astro';
import { SignUp } from '@clerk/astro/components';
---

<PublicLayout>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Sign Up</h1>
    <div class="flex justify-center">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  </div>
</PublicLayout>
```

**Note**: `redirectUrl="/"` is default. Clerk will handle redirect to origin page if configured in Clerk Dashboard.

### 5.3 Configure Redirect Behavior

In Clerk Dashboard → **Paths**:

- Set **Sign-in path** to `/sign-in`
- Set **Sign-up path** to `/sign-up`
- Configure **After sign-in redirect URL** to use origin page (or default to `/`)
- Configure **After sign-up redirect URL** to use origin page (or default to `/`)

**Alternative**: Use Clerk's `redirectUrl` prop in components, or handle redirects programmatically in middleware.

---

## Step 6: Update Navigation

### 6.1 Update Public Navigation

Update `src/components/vue/PublicNav.vue` to include sign-in link:

```vue
<!-- Add to navigation items -->
<a href="/sign-in">Sign In</a>
<a href="/sign-up">Sign Up</a>
```

### 6.2 Update Private Navigation (Future)

When protected routes are added, update `src/components/vue/PrivateNav.vue` to show user profile and sign-out button (using Clerk's UserButton component).

---

## Step 7: Set Up E2E Testing

### 7.1 Create Test Configuration

Create `specs/006-clerk-auth/e2e/auth-flow.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';

test.describe('Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    // Navigate to sign-up page
    await page.goto('/sign-up');

    // Register new user (use Clerk testing helpers)
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    await clerk.signUp({
      page,
      signUpParams: {
        emailAddress: testEmail,
        password: testPassword,
      },
    });

    // Verify registration success (should redirect)
    await expect(page).toHaveURL(/\/$|\/sign-in/); // Homepage or sign-in

    // Navigate to sign-in page
    await page.goto('/sign-in');

    // Login with registered user
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testEmail,
        password: testPassword,
      },
    });

    // Verify login success (should redirect)
    await expect(page).toHaveURL(/\/$/); // Homepage
  });
});
```

### 7.2 Create Test User Management Utilities (Optional)

For programmatic user creation/deletion in tests, create `specs/006-clerk-auth/e2e/test-helpers.ts`:

```typescript
import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * Create a test user for E2E testing
 */
export async function createTestUser(email: string, password: string) {
  const client = await clerkClient();
  const user = await client.users.createUser({
    emailAddress: [email],
    password,
    skipPasswordChecks: false,
  });
  return user;
}

/**
 * Delete a test user after E2E testing
 */
export async function deleteTestUser(userId: string) {
  const client = await clerkClient();
  await client.users.deleteUser(userId);
}
```

### 7.3 Run E2E Tests

```bash
# Run authentication flow tests
pnpm test:e2e specs/006-clerk-auth/e2e/auth-flow.spec.ts
```

---

## Step 8: Validate Implementation

### 8.1 Start Development Server

```bash
pnpm dev
```

### 8.2 Test Registration Flow

1. Navigate to `http://localhost:4321/sign-up`
2. Fill in email and password
3. Submit form
4. Verify email verification (if enabled)
5. Verify redirect to origin page (or homepage)

### 8.3 Test Login Flow

1. Navigate to `http://localhost:4321/sign-in`
2. Enter registered credentials
3. Submit form
4. Verify redirect to origin page (or homepage)

### 8.4 Run E2E Tests

```bash
pnpm test:e2e
```

Verify all tests pass.

---

## Step 9: Progressive Testing (Per Constitution)

### 9.1 Static Analysis

```bash
pnpm lint
pnpm typecheck
```

Verify no errors.

### 9.2 Browser Validation

1. Start dev server: `pnpm dev`
2. Open browser: `http://localhost:4321`
3. Navigate to `/sign-in` and `/sign-up`
4. Verify no console errors
5. Verify pages load correctly

### 9.3 E2E Validation

```bash
pnpm test:e2e specs/006-clerk-auth/e2e/
```

Verify all authentication flow tests pass.

---

## Configuration Summary

### Environment Variables

```env
# Development
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Testing (E2E)
CLERK_API_KEY=sk_test_...  # For backend SDK (same as CLERK_SECRET_KEY)
```

### Dependencies Added

```json
{
  "dependencies": {
    "@clerk/astro": "^latest"
  },
  "devDependencies": {
    "@clerk/testing": "^latest",
    "@clerk/clerk-sdk-node": "^latest"
  }
}
```

### Files Created

- `src/pages/sign-in/index.astro` - Login page
- `src/pages/sign-up/index.astro` - Registration page
- `src/middleware.ts` - Clerk middleware (optional for this phase)
- `specs/006-clerk-auth/e2e/auth-flow.spec.ts` - E2E tests

### Files Modified

- `astro.config.mjs` - Added Clerk integration
- `.env` - Added Clerk API keys
- Navigation components (if updated)

---

## Troubleshooting

### Issue: "Clerk publishable key not found"

**Solution**: Ensure `PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env` file and prefixed with `PUBLIC_`.

### Issue: "Clerk secret key not found"

**Solution**: Ensure `CLERK_SECRET_KEY` is set in `.env` file (server-side, no `PUBLIC_` prefix).

### Issue: E2E tests fail with "Bot detected"

**Solution**: Use Clerk's testing tokens or ensure tests use development application keys.

### Issue: Redirect not working after authentication

**Solution**: Check Clerk Dashboard → Paths configuration, or configure redirect URLs in component props.

---

## Next Steps

- Implement protected routes (future feature)
- Add user profile page (future feature)
- Add logout functionality (future feature)
- Customize Clerk UI components (if needed)
- Add social authentication (if needed)

---

## References

- Clerk Astro Integration: https://docs.astro.build/en/guides/authentication/
- Clerk Dashboard: https://dashboard.clerk.com/
- Clerk Testing: https://clerk.com/docs/testing/overview
- Clerk Playwright Testing: https://clerk.com/docs/guides/development/testing/playwright/test-authenticated-flows
